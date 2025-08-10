/**
 * Get Thread Service
 * Gets a single thread by its Lens feed address
 */
import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { fetchFeedFromLens } from "@/lib/external/lens/primitives/feeds";
import { fetchThread as fetchThreadDb } from "@/lib/external/supabase/threads";
import { Thread } from "@/types/common";

export interface ThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

/**
 * Gets a single thread by its Lens feed address
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getThread(threadAddress: string): Promise<ThreadResult> {
  try {
    // 1. Fetch thread record from database
    const threadRecord = await fetchThreadDb(threadAddress);
    if (!threadRecord) {
      return {
        success: false,
        error: "Thread not found in database",
      };
    }

    // 2. Fetch feed from Lens Protocol
    const feed = await fetchFeedFromLens(threadAddress);
    if (!feed) {
      return {
        success: false,
        error: "Thread feed not found on Lens Protocol",
      };
    }

    // 3. Fetch author account from Lens Protocol
    const author = await fetchAccountFromLens(threadRecord.author);
    if (!author) {
      return {
        success: false,
        error: "Thread author not found on Lens Protocol",
      };
    }

    // 4. Transform data using adapter
    const thread = await adaptFeedToThread(feed, threadRecord, author);

    return {
      success: true,
      thread,
    };
  } catch (error) {
    console.error("Failed to get thread:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get thread",
    };
  }
}
