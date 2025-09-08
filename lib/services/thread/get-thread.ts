import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostWithClient } from "@/lib/external/lens/primitives/posts";
import { client } from "@/lib/external/lens/protocol-client";
import { Post, SessionClient } from "@lens-protocol/client";

export interface ThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

/**
 * Gets a single thread by its Lens feed address
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getThread(threadAddress: string, sessionClient?: SessionClient): Promise<ThreadResult> {
  try {
    // 4. Fetch root post if not already included in threadRecord
    const lensClient = sessionClient || client;
    const rootPost = await fetchPostWithClient(threadAddress as string, lensClient);

    // 5. Transform data using adapter
    const thread = await adaptFeedToThread(rootPost.author, rootPost as Post);

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error("Failed to get thread:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get thread",
    };
  }
}
