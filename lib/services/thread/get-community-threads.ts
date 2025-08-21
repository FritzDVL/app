/**
 * Get Community Threads Service
 * Gets all threads for a community using optimized batch operations
 */
import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchFeedsBatch } from "@/lib/external/lens/primitives/feeds";
import { fetchPostsBatch } from "@/lib/external/lens/primitives/posts";
import { fetchCommunityThreads } from "@/lib/external/supabase/threads";

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Gets all threads for a community using optimized batch operations
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getCommunityThreads(communityAddress: string): Promise<ThreadsResult> {
  try {
    // 1. Fetch thread records from database
    const threadRecords = await fetchCommunityThreads(communityAddress);
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
    for (const { address, result } of feedResults) {
      feedMap.set(address, result);
    }
    const rootPostMap = new Map();
    for (const post of rootPostResults) {
      if (post && post.id) rootPostMap.set(post.id, post);
    }

    // 5. Transform threads¡
    const threads = (
      await Promise.all(
        threadRecords.map(async threadRecord => {
          const feed = feedMap.get(threadRecord.lens_feed_address);
          const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) : null;
          // author y rootPost siempre existen según tu aclaración
          return adaptFeedToThreadOptimized(feed, threadRecord, rootPost?.author, rootPost);
        })
      )
    ).filter(Boolean) as Thread[];

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
}
