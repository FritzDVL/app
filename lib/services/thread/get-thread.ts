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
  threadDb: CommunityThreadSupabase,
  rootPostId: string,
  sessionClient?: SessionClient,
): Promise<ThreadResult> {
  try {
    if (!threadDb && !rootPostId) {
      return { success: false, error: "Thread not found" };
    }

    const postId = rootPostId || threadDb?.root_post_id;
    if (!postId) {
      return { success: false, error: "Thread not found" };
    }

    const lensClient = sessionClient || client;
    const rootPost = await fetchPostWithClient(postId as string, lensClient);

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
  if (!threadDb) {
    throw new Error("Thread not found");
  }
  return getThreadCommon(threadDb, rootPostId, sessionClient);
}

/**
 * Gets a single thread by its slug
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getThreadBySlug(slug: string, sessionClient?: SessionClient): Promise<ThreadResult> {
  const threadDb = await fetchThread({ slug });
  if (!threadDb) {
    throw new Error("Thread not found");
  }
  return getThreadCommon(threadDb, threadDb.root_post_id, sessionClient);
}
