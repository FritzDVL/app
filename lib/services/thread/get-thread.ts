import { adaptExternalFeedToThread, adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostWithClient } from "@/lib/external/lens/primitives/posts";
import { client } from "@/lib/external/lens/protocol-client";
import { fetchThread } from "@/lib/external/supabase/threads";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Post, SessionClient } from "@lens-protocol/client";

export interface ThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

/**
 * Common function to fetch a thread from DB, get the post from Lens, and adapt it
 * Handles the complete workflow for retrieving a thread
 */
async function getThreadCommon(
  threadDb: CommunityThreadSupabase | null,
  rootPostId: string | null,
  sessionClient?: SessionClient,
): Promise<ThreadResult> {
  try {
    // Determine the post ID to fetch
    const postId = rootPostId || threadDb?.root_post_id;
    if (!postId) {
      return { success: false, error: "Thread not found - no post ID available" };
    }

    // Fetch the post from Lens Protocol
    const lensClient = sessionClient || client;
    const rootPost = await fetchPostWithClient(postId, lensClient);

    if (!rootPost || rootPost.__typename !== "Post") {
      return { success: false, error: "Thread post not found on Lens Protocol" };
    }

    // Adapt the thread based on whether we have DB data
    let thread: Thread;
    if (threadDb) {
      // We have DB metadata, use it for the full thread adaptation
      thread = await adaptFeedToThread(rootPost.author, threadDb, rootPost as Post);
    } else {
      // No DB metadata, create thread from Lens data only (external thread)
      thread = await adaptExternalFeedToThread(rootPost as Post);
    }

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error(`Failed to get thread:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get thread",
    };
  }
}

/**
 * Gets a single thread by its root post ID
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getThread(rootPostId: string, sessionClient?: SessionClient): Promise<ThreadResult> {
  const threadDb = await fetchThread({ rootPostId: rootPostId });
  return getThreadCommon(threadDb, rootPostId, sessionClient);
}

/**
 * Gets a single thread by its slug
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getThreadBySlug(slug: string, sessionClient?: SessionClient): Promise<ThreadResult> {
  const threadDb = await fetchThread({ slug });
  return getThreadCommon(threadDb, threadDb?.root_post_id || null, sessionClient);
}
