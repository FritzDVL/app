import { revalidateCommunityAndListPaths, revalidateHomePath } from "@/app/actions/revalidate-path";
import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { createThreadArticle } from "@/lib/external/lens/primitives/articles";
import { generateThreadSlug } from "@/lib/external/slug/generate-slug";
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
    const slug = generateThreadSlug(formData.title);
    const articleFormData = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      summary: formData.summary,
      tags: formData.tags,
      feedAddress: community.feed.address,
      slug,
    };

    const articleResult = await createThreadArticle(articleFormData, sessionClient, walletClient);

    if (!articleResult.success || !articleResult.post) {
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

    // 4. Save thread in database
    const authorDb = author.username?.localName || author.address;
    const persistedThread = await persistCommunityThread(
      community.group.address,
      formData.title,
      formData.summary,
      authorDb,
      articleResult.post?.id,
      slug,
    );

    const thread = await adaptFeedToThread(author, persistedThread, rootPost);

    // 5. Revalidate paths
    await revalidateCommunityAndListPaths(community.group.address);
    await revalidateHomePath();

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
