/**
 * Get Featured Threads Service
 * Gets featured threads using optimized batch operations
 */
import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchFeedsBatch } from "@/lib/external/lens/primitives/feeds";
import { fetchPostsBatch } from "@/lib/external/lens/primitives/posts";
import { fetchFeaturedThreads as fetchFeaturedThreadsDb } from "@/lib/external/supabase/threads";

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Gets featured threads using optimized batch operations
 */
export async function getFeaturedThreads(limit: number = 5): Promise<ThreadsResult> {
  try {
    // 1. Fetch featured thread records from database
    const threadRecords = await fetchFeaturedThreadsDb(limit);
    if (!threadRecords.length) {
      return {
        success: true,
        threads: [],
      };
    }

    // 2. Extract unique addresses for batching
    const feedAddresses = threadRecords.map(record => record.lens_feed_address);
    const rootPostIds = threadRecords.map(record => record.root_post_id).filter((id): id is string => id !== null);

    // 3. Batch fetch all data in parallel
    const [feedResults, rootPostResults] = await Promise.all([
      fetchFeedsBatch(feedAddresses),
      rootPostIds.length > 0 ? fetchPostsBatch(rootPostIds) : Promise.resolve([]),
    ]);

    // 4. Create lookup maps for O(1) access
    const feedMap = new Map();
    feedResults.forEach(({ address, result }) => {
      feedMap.set(address, result);
    });

    const rootPostMap = new Map();
    rootPostResults.forEach(post => {
      rootPostMap.set(post.id, post);
    });

    // 5. Transform threads using cached data (map/filter for performance)
    const threadPromises = threadRecords.map(async threadRecord => {
      const feed = feedMap.get(threadRecord.lens_feed_address);
      const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) : null;
      const author = rootPost?.author;
      if (!feed || !author) return null;
      return await adaptFeedToThreadOptimized(feed, threadRecord, author, rootPost);
    });

    const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch featured threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured threads",
    };
  }
}
