"use server";

/**
 * Create Thread Service
 * Creates a thread using the full business logic
 */
import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { storageClient } from "@/lib/external/grove/client";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { lensChain } from "@/lib/external/lens/chain";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { createThreadArticle } from "@/lib/external/lens/primitives/articles";
import { persistCommunityThread, persistRootPostId } from "@/lib/external/supabase/threads";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { Thread } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { evmAddress } from "@lens-protocol/client";
import { createFeed, fetchFeed } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { feed } from "@lens-protocol/metadata";

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
): Promise<CreateThreadResult> {
  try {
    // Get admin session and wallet
    const adminSessionClient = await getAdminSessionClient();
    const adminWallet = await getAdminWallet();

    // 1. Build metadata for the thread feed
    const feedMetadata = feed({
      name: formData.title,
      description: formData.summary || "",
    });
    const acl = immutable(lensChain.id);

    // 2. Upload feed metadata to storage
    const { uri: feedUri } = await storageClient.uploadAsJson(feedMetadata, { acl });

    // 3. Create the feed on Lens Protocol
    const feedCreationResult = await createFeed(adminSessionClient, {
      metadataUri: feedUri,
      admins: [evmAddress(ADMIN_USER_ADDRESS)],
      rules: {
        required: [
          {
            groupGatedRule: {
              group: evmAddress(communityAddress),
            },
          },
        ],
      },
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen(txHash => fetchFeed(adminSessionClient, { txHash }));

    if (feedCreationResult.isErr()) {
      console.error("[Service] Error creating feed:", feedCreationResult.error);
      return {
        success: false,
        error: feedCreationResult.error.message,
      };
    }

    const createdFeed = feedCreationResult.value;
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
      adminSessionClient,
      adminWallet,
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
