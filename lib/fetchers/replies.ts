import { APP_ADDRESS } from "../constants";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { Address, PaginatedRepliesResult, Reply } from "@/types/common";
import { Account, Post as LensPost, PageSize, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPosts } from "@lens-protocol/client/actions";

type AuthorResult = {
  address: string;
  result: Account | null;
};

/**
 * Generic batched reply fetcher that optimizes Lens Protocol API calls
 * @param posts - Array of Lens posts to transform into replies
 * @returns Promise<Reply[]>
 */
async function fetchRepliesBatched(posts: LensPost[]): Promise<Reply[]> {
  if (!posts.length) return [];

  // 1. Extract unique author addresses for batching
  const authorAddresses = [...new Set(posts.map(post => evmAddress(post.author.address)))];

  // 2. Batch fetch all unique authors in parallel
  const authorPromises = authorAddresses.map(address =>
    fetchAccount(client, { address }).then(result => ({
      address,
      result: result.isOk() ? result.value : null,
    })),
  );

  // 3. Wait for all batched requests to complete
  const authorResults = await Promise.all(authorPromises);

  // 4. Create lookup map for O(1) access
  const authorMap = new Map<string, Account | null>();
  (authorResults as AuthorResult[]).forEach(({ address, result }) => {
    authorMap.set(address, result);
  });

  // 5. Transform posts to replies using cached author data
  const replies: Reply[] = [];
  for (const post of posts) {
    try {
      const author = authorMap.get(evmAddress(post.author.address));

      if (!author) {
        console.warn(`Missing author data for post ${post.id}:`, {
          authorAddress: post.author.address,
        });
        continue;
      }

      replies.push(
        transformPostToReply(post, {
          name: author.username?.localName || "Unknown Author",
          username: author.username?.value || "unknown",
          avatar: author.metadata?.picture || "",
          reputation: author.score || 0,
          address: author.address,
        }),
      );
    } catch (error) {
      console.warn(`Error transforming post ${post.id}:`, error);
      continue;
    }
  }

  return replies;
}

/**
 * Fetches all replies for a given thread address and root post id, enriches them with Lens Protocol data, and returns a Reply[] array.
 * Now optimized with batched API calls for better performance.
 * @param threadAddress - The Lens Protocol thread address
 * @param rootPostId - The root post id to exclude from replies
 */
export async function fetchReplies(threadAddress: string): Promise<Reply[]> {
  const result = await fetchPosts(client, {
    filter: {
      feeds: [{ feed: evmAddress(threadAddress) }],
    },
  });
  if (!result.isOk() || !result.value.items) return [];

  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
  ) as LensPost[];

  validPosts.sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });

  // Use batched fetching for better performance
  return await fetchRepliesBatched(validPosts);
}

/**
 * Fetches paginated replies for a given thread address using Lens Protocol's cursor-based pagination.
 * Now optimized with batched API calls for better performance.
 * @param threadAddress - The Lens Protocol thread address
 * @param pageSize - Number of replies per page (optional)
 * @param cursor - Pagination cursor (optional)
 * @returns { items: Reply[], pageInfo: { prev: string | null, next: string | null } }
 */
export async function fetchRepliesPaginated(
  threadAddress: string,
  pageSize?: PageSize,
  cursor?: string | null,
): Promise<PaginatedRepliesResult> {
  const params: any = {
    filter: {
      feeds: [{ feed: evmAddress(threadAddress) }],
    },
  };
  if (pageSize) params.pageSize = pageSize;
  if (cursor) params.cursor = cursor;

  const result = await fetchPosts(client, params);
  if (!result.isOk() || !result.value.items) {
    return { items: [], pageInfo: { prev: null, next: null } };
  }

  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
  ) as LensPost[];

  // Optimize with batched account fetching
  const replies = await fetchRepliesBatched(validPosts);

  return { items: replies, pageInfo: result.value.pageInfo };
}

export async function fetchLatestRepliesByAuthor(author: Address, limit: number = 10): Promise<Reply[]> {
  const replies: Reply[] = [];
  try {
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(author)],
        apps: [evmAddress(APP_ADDRESS)],
      },
    });

    if (result.isErr()) {
      console.error("Failed to fetch latest replies by author:", result.error);
      return [];
    }

    if (!result.value.items) return [];

    const validPosts = result.value.items.filter(
      (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
    ) as LensPost[];
    validPosts.sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return bTime - aTime; // Sort newest to oldest
    });

    for (const post of validPosts.slice(0, limit)) {
      replies.push(
        transformPostToReply(post, {
          name: post.author.username?.localName || "Unknown Author",
          username: post.author.username?.value || "unknown",
          avatar: post.author.metadata?.picture || "",
          reputation: post.author.score || 0,
          address: post.author.address,
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching latest replies by author:", error);
    return [];
  }
  return replies;
}
