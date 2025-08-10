"use server";

import { client } from "@/lib/external/lens/protocol-client";
import type { AnyPost } from "@lens-protocol/client";
import { fetchPost } from "@lens-protocol/client/actions";

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
