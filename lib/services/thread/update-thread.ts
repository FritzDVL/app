/**
 * Update Thread Service
 * Updates thread content using Lens Protocol
 */
import { Thread } from "@/lib/domain/threads/types";
import { updateThreadArticle as updateArticleLens } from "@/lib/external/lens/primitives/articles";
import { updateThread as updateThreadDb } from "@/lib/external/supabase/threads";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export interface UpdateThreadData {
  title: string;
  summary: string;
  content: string;
  tags?: string;
}

export interface UpdateThreadResult {
  success: boolean;
  error?: string;
}

/**
 * Updates a thread's root post content
 */
export async function updateThread(
  thread: Thread,
  updateData: UpdateThreadData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<UpdateThreadResult> {
  try {
    if (!thread.rootPost?.id) {
      return {
        success: false,
        error: "Thread root post not found",
      };
    }

    const result = await updateArticleLens(
      {
        title: updateData.title,
        summary: updateData.summary,
        content: updateData.content,
        tags: updateData.tags,
        postId: thread.rootPost.id,
        feedAddress: "0x0",
        author: thread.author.address,
        slug: thread.slug,
      },
      sessionClient,
      walletClient,
    );
    if (!result.success) {
      return { success: false, error: result.error };
    }
    // Update thread in Supabase with new title, summary, and postId if needed
    await updateThreadDb(thread.rootPost.id, updateData.title, updateData.summary);

    return { success: true };
  } catch (error) {
    console.error("Thread update failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update thread",
    };
  }
}
