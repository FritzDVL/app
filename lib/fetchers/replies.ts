import { APP_ADDRESS } from "../constants";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { Address, PaginatedRepliesResult, Reply } from "@/types/common";
import { Post as LensPost, PageSize, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPosts } from "@lens-protocol/client/actions";

/**
 * Fetches all replies for a given thread address and root post id, enriches them with Lens Protocol data, and returns a Reply[] array.
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
  const replies: Reply[] = [];
  for (const post of validPosts) {
    try {
      const accountResult = await fetchAccount(client, { address: evmAddress(post.author.address) });
      if (accountResult.isOk() && accountResult.value) {
        const author = accountResult.value;
        replies.push(
          transformPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
          }),
        );
      }
    } catch {
      continue;
    }
  }
  return replies;
}

/**
 * Fetches paginated replies for a given thread address using Lens Protocol's cursor-based pagination.
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

  const replies: Reply[] = [];
  for (const post of validPosts) {
    try {
      const accountResult = await fetchAccount(client, { address: evmAddress(post.author.address) });
      if (accountResult.isOk() && accountResult.value) {
        const author = accountResult.value;
        replies.push(
          transformPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
          }),
        );
      }
    } catch {
      continue;
    }
  }

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
        }),
      );
    }
  } catch (error) {
    console.error("Error fetching latest replies by author:", error);
    return [];
  }
  return replies;
}
