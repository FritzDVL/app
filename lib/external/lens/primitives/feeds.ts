"use server";

import { storageClient } from "@/lib/external/grove/client";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { lensChain } from "@/lib/external/lens/chain";
import { client } from "@/lib/external/lens/protocol-client";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { immutable } from "@lens-chain/storage-client";
import { evmAddress } from "@lens-protocol/client";
import type { Feed } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";
import { createFeed as createLensFeed } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { feed } from "@lens-protocol/metadata";

/**
 * Fetches a single feed from Lens Protocol
 */
export async function fetchFeedFromLens(feedAddress: string): Promise<Feed | null> {
  try {
    const result = await fetchFeed(client, {
      feed: evmAddress(feedAddress),
    });

    if (result.isErr() || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error("Failed to fetch feed from Lens:", error);
    throw new Error(`Failed to fetch feed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch fetch multiple feeds from Lens Protocol
 */
export async function fetchFeedsBatch(
  feedAddresses: string[],
): Promise<Array<{ address: string; result: Feed | null }>> {
  try {
    const feedPromises = feedAddresses.map(async address => {
      const result = await fetchFeed(client, { feed: evmAddress(address) });
      return {
        address,
        result: result.isOk() ? result.value : null,
      };
    });

    return await Promise.all(feedPromises);
  } catch (error) {
    console.error("Failed to batch fetch feeds from Lens:", error);
    throw new Error(`Failed to batch fetch feeds: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export interface FeedCreationData {
  title: string;
  description?: string;
  communityAddress: string;
}

export interface FeedCreationResult {
  success: boolean;
  feed?: Feed;
  error?: string;
}

/**
 * Creates a thread feed using admin clients
 */
export async function createFeed(feedData: FeedCreationData): Promise<FeedCreationResult> {
  try {
    // Get admin clients
    const adminSessionClient = await getAdminSessionClient();
    const adminWallet = await getAdminWallet();
    // 1. Build metadata for the thread feed
    const feedMetadata = feed({
      name: feedData.title,
      description: feedData.description || "",
    });
    const acl = immutable(lensChain.id);

    // 2. Upload feed metadata to storage
    const { uri: feedUri } = await storageClient.uploadAsJson(feedMetadata, { acl });

    // 3. Create the feed on Lens Protocol
    const feedCreationResult = await createLensFeed(adminSessionClient, {
      metadataUri: feedUri,
      admins: [evmAddress(ADMIN_USER_ADDRESS)],
      rules: {
        required: [
          {
            groupGatedRule: {
              group: evmAddress(feedData.communityAddress),
            },
          },
        ],
      },
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen(txHash => fetchFeed(adminSessionClient, { txHash }));

    if (feedCreationResult.isErr()) {
      console.error("[Feeds] Error creating feed:", feedCreationResult.error);
      return {
        success: false,
        error: feedCreationResult.error instanceof Error ? feedCreationResult.error.message : "Failed to create feed",
      };
    }

    const createdFeed = feedCreationResult.value;
    if (!createdFeed) {
      return {
        success: false,
        error: "Failed to create feed: No feed returned",
      };
    }

    return {
      success: true,
      feed: createdFeed,
    };
  } catch (error) {
    console.error("Feed creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create feed",
    };
  }
}
