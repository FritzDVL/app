import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunityThreads } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchFeed } from "@lens-protocol/client/actions";

/**
 * Fetches all threads for a given community address, enriches them with Lens Protocol data, and returns a Thread[] array.
 * @param communityAddress - The Lens Protocol community address
 */
export async function fetchThreads(communityAddress: string): Promise<Thread[]> {
  // Get thread records from database
  const threadRecords = await fetchCommunityThreads(communityAddress);
  if (!threadRecords.length) return [];

  const threadsData: Thread[] = [];

  for (const threadRecord of threadRecords) {
    try {
      // Fetch the feed for the thread
      const feedResult = await fetchFeed(client, {
        feed: evmAddress(threadRecord.lens_feed_address),
      });
      if (feedResult.isErr()) {
        throw new Error(`Failed to fetch feed: ${feedResult.error.message}`);
      }
      const feed = feedResult.value;
      if (!feed) {
        throw new Error(`Feed not found for address: ${threadRecord.lens_feed_address}`);
      }

      // Fetch the account for the thread author
      const accountRequest = await fetchAccount(client, {
        address: evmAddress(threadRecord.author),
      });
      if (accountRequest.isErr()) {
        throw new Error(`Failed to fetch account: ${accountRequest.error.message}`);
      }
      const author = accountRequest.value;
      if (!author) {
        throw new Error(`Account not found for address: ${feed.owner}`);
      }
      const thread = await transformFeedToThread(feed, threadRecord, author);
      threadsData.push(thread);
    } catch (err) {
      console.warn(`Error fetching thread ${threadRecord.lens_feed_address}:`, err);
      continue;
    }
  }
  return threadsData;
}
