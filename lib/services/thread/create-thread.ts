import { revalidateCommunityAndListPaths, revalidateHomePath } from "@/app/actions/revalidate-path";
import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { createThreadArticle } from "@/lib/external/lens/primitives/articles";
import { generateThreadSlug } from "@/lib/external/slug/generate-slug";
import { persistCommunityThread } from "@/lib/external/supabase/threads";
import { Address } from "@/types/common";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

export async function createThread(
  communityGroupAddress: Address,
  communityFeedAddress: Address,
  formData: FormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<CreateThreadResult> {
  try {
    // Extract data from FormData
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as Address;
    const summary = formData.get("summary") as string;
    const tags = formData.get("tags") as string | null;

    // 1. Generate unique slug for the thread
    let slug: string;
    try {
      slug = await generateThreadSlug(title);
      console.log("Step 2.1: Slug generated successfully:", slug);
    } catch (slugError) {
      console.error("Step 2 FAILED: Error generating slug:", slugError);
      return {
        success: false,
        error: `Failed to generate slug: ${slugError instanceof Error ? slugError.message : "Unknown error"}`,
      };
    }
    // 2. Create the root post for the thread using article primitive
    const articleFormData = {
      title,
      content,
      author,
      summary,
      tags: tags || undefined,
      feedAddress: communityFeedAddress,
      slug,
    };
    console.log("Article form data:", articleFormData);
    const articleResult = await createThreadArticle(articleFormData, sessionClient, walletClient);
    console.log("Article creation result:", articleResult);
    if (!articleResult.success || !articleResult.post) {
      console.error("[Service] Error creating thread article:", articleResult.error);
      return {
        success: false,
        error: articleResult.error || "Failed to create thread article",
      };
    }

    const rootPost = articleResult.post;

    // 3. Fetch author account for transformation
    const authorAccount = await fetchAccountFromLens(author);
    if (!authorAccount) {
      return {
        success: false,
        error: "Failed to fetch author account",
      };
    }

    // 4. Transform to Thread object using adapter
    if (!rootPost || rootPost.__typename !== "Post") {
      return {
        success: false,
        error: "Root post is missing or not a valid Post",
      };
    }

    // 5. Save thread in database
    const authorDb = authorAccount.username?.localName || authorAccount.address;
    const persistedThread = await persistCommunityThread(
      communityGroupAddress,
      title,
      summary,
      authorDb,
      articleResult.post?.id,
      slug,
    );

    await adaptFeedToThread(authorAccount, persistedThread, rootPost);

    // 6. Revalidate paths
    await revalidateCommunityAndListPaths(communityGroupAddress);
    await revalidateHomePath();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Thread creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread",
    };
  }
}
