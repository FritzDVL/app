import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { createThreadArticle } from "@/lib/external/lens/primitives/articles";
import { persistCommunityThread } from "@/lib/external/supabase/threads";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

export async function createThread(
  community: Community,
  formData: CreateThreadFormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<CreateThreadResult> {
  try {
    // 1. Create the root post for the thread using article primitive
    const articleFormData = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      summary: formData.summary,
      tags: formData.tags,
      feedAddress: community.feed.address,
    };

    const articleResult = await createThreadArticle(articleFormData, sessionClient, walletClient);

    if (!articleResult.success) {
      console.error("[Service] Error creating thread article:", articleResult.error);
      return {
        success: false,
        error: articleResult.error || "Failed to create thread article",
      };
    }

    const rootPost = articleResult.post;

    // 2. Fetch author account for transformation
    const author = await fetchAccountFromLens(formData.author);
    if (!author) {
      return {
        success: false,
        error: "Failed to fetch author account",
      };
    }

    // 3. Transform to Thread object using adapter
    if (!rootPost || rootPost.__typename !== "Post") {
      return {
        success: false,
        error: "Root post is missing or not a valid Post",
      };
    }
    const thread = await adaptFeedToThread(author, rootPost);

    // 4. Save thread in database
    try {
      const authorDb = author.username?.localName || author.address;
      await persistCommunityThread(community.group.address, formData.title, formData.summary, authorDb);
    } catch (dbError) {
      console.error("Failed to persist thread in database:", dbError);
      return {
        success: false,
        error: `Failed to persist thread in database: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
      };
    }

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
