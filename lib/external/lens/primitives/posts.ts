"use server";

import { client } from "@/lib/external/lens/protocol-client";
import { APP_ADDRESS } from "@/lib/shared/constants";
import { Address } from "@/types/common";
import type { AnyPost, Post as LensPost, PageSize, PostId } from "@lens-protocol/client";
import { PostReferenceType, ReferenceRelevancyFilter, evmAddress } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences, fetchPosts } from "@lens-protocol/client/actions";

export interface PaginatedPostsResult {
  posts: LensPost[];
  pageInfo: any;
}

/**
 * Batch fetch multiple posts from Lens Protocol
 */
export async function fetchPostsBatch(postIds: string[]): Promise<Array<{ postId: string; result: AnyPost | null }>> {
  try {
    const postPromises = postIds.map(async postId => {
      const result = await fetchPost(client, { post: postId });
      return {
        postId,
        result: result.isOk() ? result.value : null,
      };
    });

    return await Promise.all(postPromises);
  } catch (error) {
    console.error("Failed to batch fetch posts from Lens:", error);
    throw new Error(`Failed to batch fetch posts: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
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

  const sortedPosts = validPosts.toSorted((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });

  return {
    posts: sortedPosts,
    pageInfo: result.value.pageInfo,
  };
}

/**
 * Fetch all posts for a thread (non-paginated)
 */
export async function fetchCommentsByPostId(postId: PostId): Promise<LensPost[]> {
  const result = await fetchPostReferences(client, {
    referencedPost: postId,
    referenceTypes: [PostReferenceType.CommentOn],
    relevancyFilter: ReferenceRelevancyFilter.Relevant,
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
