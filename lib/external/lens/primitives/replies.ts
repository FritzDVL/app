/**
 * Lens Protocol Reply Primitives
 * Optimized batch operations for reply-related data fetching
 */
import { client } from "@/lib/external/lens/protocol-client";
import { APP_ADDRESS } from "@/lib/shared/constants";
import { Address } from "@/types/common";
import { Account, Post as LensPost, PageSize, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPosts } from "@lens-protocol/client/actions";

export interface BatchAccountResult {
  address: string;
  result: Account | null;
}

export interface PaginatedPostsResult {
  posts: LensPost[];
  pageInfo: any;
}

/**
 * Batch fetch accounts for multiple addresses
 */
export async function fetchAccountsBatch(addresses: string[]): Promise<BatchAccountResult[]> {
  if (!addresses.length) return [];

  const uniqueAddresses = [...new Set(addresses)];

  const promises = uniqueAddresses.map(address =>
    fetchAccount(client, { address: evmAddress(address) }).then(result => ({
      address,
      result: result.isOk() ? result.value : null,
    })),
  );

  return Promise.all(promises);
}

/**
 * Fetch posts for a thread with pagination
 */
export async function fetchThreadPosts(
  threadAddress: string,
  pageSize?: PageSize,
  cursor?: string | null,
): Promise<PaginatedPostsResult> {
  const params: any = {
    filter: {
      feeds: [{ feed: evmAddress(threadAddress) }],
    },
  };

  if (pageSize) params.pageSize = pageSize;
  if (cursor) params.cursor = cursor;

  const result = await fetchPosts(client, params);

  if (!result.isOk() || !result.value.items) {
    return { posts: [], pageInfo: { prev: null, next: null } };
  }

  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
  ) as LensPost[];

  return {
    posts: validPosts,
    pageInfo: result.value.pageInfo,
  };
}

/**
 * Fetch all posts for a thread (non-paginated)
 */
export async function fetchAllThreadPosts(threadAddress: string): Promise<LensPost[]> {
  const result = await fetchPosts(client, {
    filter: {
      feeds: [{ feed: evmAddress(threadAddress) }],
    },
  });

  if (!result.isOk() || !result.value.items) return [];

  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
  ) as LensPost[];

  // Sort by timestamp (oldest first)
  validPosts.sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });

  return validPosts;
}

/**
 * Fetch latest posts by author
 */
export async function fetchPostsByAuthor(author: Address, limit: number = 10): Promise<LensPost[]> {
  const result = await fetchPosts(client, {
    filter: {
      authors: [evmAddress(author)],
      apps: [evmAddress(APP_ADDRESS)],
    },
  });

  if (!result.isOk() || !result.value.items) return [];

  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address,
  ) as LensPost[];

  // Sort by timestamp (newest first)
  validPosts.sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return bTime - aTime;
  });

  return validPosts.slice(0, limit);
}
