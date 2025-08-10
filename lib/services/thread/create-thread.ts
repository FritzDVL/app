/**
 * Create Thread Service
 * Creates a thread using the full business logic
 */
import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { createThreadArticle } from "@/lib/external/lens/primitives/articles";
import { persistCommunityThread, persistRootPostId } from "@/lib/external/supabase/threads";
import { Thread } from "@/types/common";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

/**
 * Creates a thread using the full business logic
 * Orchestrates the entire thread creation process including root post
 */
export async function createThread(
  communityAddress: string,
  formData: CreateThreadFormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<CreateThreadResult> {
  try {
    // 1. Create the feed via API (server-side with admin clients)
    const feedResponse = await fetch("/api/feeds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.summary,
        communityAddress,
      }),
    });

    if (!feedResponse.ok) {
      const errorData = await feedResponse.json().catch(() => ({}));
      console.error("[Service] Error creating thread feed:", errorData);
      return {
        success: false,
        error: errorData.error || "Failed to create thread feed",
      };
    }

    const feedResult = await feedResponse.json();
    if (!feedResult.success) {
      console.error("[Service] Error creating thread feed:", feedResult.error);
      return {
        success: false,
        error: feedResult.error || "Failed to create thread feed",
      };
    }

    const createdFeed = feedResult.feed;
    if (!createdFeed) {
      return {
        success: false,
        error: "Failed to create feed: No feed returned",
      };
    }

    // 4. Create the root post for the thread using article primitive
    const articleResult = await createThreadArticle(
      {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        author: formData.author,
        tags: formData.tags,
        feedAddress: createdFeed.address,
      },
      sessionClient,
      walletClient,
    );

    if (!articleResult.success) {
      console.error("[Service] Error creating thread article:", articleResult.error);
      return {
        success: false,
        error: articleResult.error || "Failed to create thread article",
      };
    }

    const rootPost = articleResult.post;

    // 5. Persist the thread in Supabase
    const threadRecord = await persistCommunityThread(communityAddress, createdFeed.address, formData.author);

    // 6. Update thread record with root post ID if available
    if (rootPost?.id) {
      await persistRootPostId(threadRecord.id, rootPost.id);
    }

    // 7. Fetch author account for transformation
    const author = await fetchAccountFromLens(formData.author);
    if (!author) {
      return {
        success: false,
        error: "Failed to fetch author account",
      };
    }

    // 8. Transform to Thread object using adapter
    const thread = await adaptFeedToThreadOptimized(
      createdFeed,
      threadRecord,
      author,
      rootPost?.__typename === "Post" ? rootPost : null,
    );

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error("Thread creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread",
    };
  }
}
