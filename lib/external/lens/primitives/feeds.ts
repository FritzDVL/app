"use server";

import { client } from "@/lib/external/lens/protocol-client";
import { evmAddress } from "@lens-protocol/client";
import type { Feed } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";

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
