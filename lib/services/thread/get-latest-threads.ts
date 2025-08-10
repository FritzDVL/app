/**
 * Get Latest Threads Service
 * Gets latest threads using optimized batch operations
 */
import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { fetchAccountsBatch } from "@/lib/external/lens/primitives/accounts";
import { fetchFeedsBatch } from "@/lib/external/lens/primitives/feeds";
import { fetchPostsBatch } from "@/lib/external/lens/primitives/posts";
import { fetchLatestThreads as fetchLatestThreadsDb } from "@/lib/external/supabase/threads";
import { Thread } from "@/types/common";

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Gets latest threads using optimized batch operations
 */
export async function getLatestThreads(limit: number = 5): Promise<ThreadsResult> {
  try {
    // 1. Fetch latest thread records from database
    const threadRecords = await fetchLatestThreadsDb(limit);
    if (!threadRecords.length) {
      return {
        success: true,
        threads: [],
      };
    }

    // 2. Extract unique addresses for batching
    const feedAddresses = threadRecords.map(record => record.lens_feed_address);
    const authorAddresses = [...new Set(threadRecords.map(record => record.author))];
    const rootPostIds = threadRecords.map(record => record.root_post_id).filter((id): id is string => id !== null);

    // 3. Batch fetch all data in parallel
    const [feedResults, authorResults, rootPostResults] = await Promise.all([
      fetchFeedsBatch(feedAddresses),
      fetchAccountsBatch(authorAddresses),
      rootPostIds.length > 0 ? fetchPostsBatch(rootPostIds) : Promise.resolve([]),
    ]);

    // 4. Create lookup maps for O(1) access
    const feedMap = new Map();
    feedResults.forEach(({ address, result }) => {
      feedMap.set(address, result);
    });

    const authorMap = new Map();
    authorResults.forEach(({ address, result }) => {
      authorMap.set(address, result);
    });

    const rootPostMap = new Map();
    rootPostResults.forEach(({ postId, result }) => {
      rootPostMap.set(postId, result);
    });

    // 5. Transform threads using cached data
    const threads: Thread[] = [];
    for (const threadRecord of threadRecords) {
      try {
        const feed = feedMap.get(threadRecord.lens_feed_address);
        const author = authorMap.get(threadRecord.author);

        if (!feed || !author) {
          console.warn(`Missing data for thread ${threadRecord.lens_feed_address}:`, {
            hasFeed: !!feed,
            hasAuthor: !!author,
          });
          continue;
        }

        const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) || null : null;
        const thread = await adaptFeedToThreadOptimized(feed, threadRecord, author, rootPost);
        threads.push(thread);
      } catch (error) {
        console.warn(`Error transforming thread ${threadRecord.lens_feed_address}:`, error);
        continue;
      }
    }

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch latest threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch latest threads",
    };
  }
}
