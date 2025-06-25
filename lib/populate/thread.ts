import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchThread } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchFeed } from "@lens-protocol/client/actions";

/**
 * Fetches and enriches a single thread by its Lens feed address, without using any store.
 * @param threadAddress - The Lens Protocol feed address
 * @returns Promise<Thread | null>
 */
export async function populateThread(threadAddress: string): Promise<Thread | null> {
  try {
    // Fetch the thread record from the database
    const threadRecord = await fetchThread(threadAddress);
    if (!threadRecord) return null;

    // Fetch the feed from Lens Protocol
    const feedResult = await fetchFeed(client, {
      feed: evmAddress(threadAddress),
    });
    if (feedResult.isErr() || !feedResult.value) return null;

    // Fetch author account for transformer
    const accountRequest = await fetchAccount(client, { address: evmAddress(threadRecord.author) });
    if (accountRequest.isErr() || !accountRequest.value) return null;

    // Transform and enrich the thread
    const thread = await transformFeedToThread(feedResult.value, threadRecord, accountRequest.value);
    return thread;
  } catch (error) {
    console.error("Failed to populate thread", error);
    return null;
  }
}
