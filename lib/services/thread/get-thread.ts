import { adaptExternalFeedToThread, adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostWithClient } from "@/lib/external/lens/primitives/posts";
import { client } from "@/lib/external/lens/protocol-client";
import { fetchThread } from "@/lib/external/supabase/threads";
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
export async function getThread(rootPostId: string, sessionClient?: SessionClient): Promise<ThreadResult> {
  try {
    // 1. Fetch thread DB record
    const threadDb = await fetchThread({ rootPostId: rootPostId });
    const lensClient = sessionClient || client;
    const rootPost = await fetchPostWithClient(rootPostId as string, lensClient);

    let thread: Thread | undefined;
    if (threadDb && rootPost) {
      thread = await adaptFeedToThread(rootPost.author, threadDb, rootPost as Post);
    } else if (!threadDb && rootPost && rootPost.__typename === "Post") {
      thread = await adaptExternalFeedToThread(rootPost as Post);
    }

    if (!thread) {
      return { success: false, error: "Thread not found" };
    }

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
