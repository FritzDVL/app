import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsBatch } from "@/lib/external/lens/primitives/posts";
import { fetchLatestThreads as fetchLatestThreadsDb } from "@/lib/external/supabase/threads";

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
    const rootPostIds = threadRecords.map(record => record.root_post_id).filter((id): id is string => id !== null);

    // 3. Batch fetch all data in parallel
    const [rootPostsResults] = await Promise.all([
      rootPostIds.length > 0 ? fetchPostsBatch(rootPostIds) : Promise.resolve([]),
    ]);

    const rootPostMap = new Map();
    rootPostsResults.forEach(post => {
      rootPostMap.set(post.id, post);
    });

    // 5. Transform threads using cached data
    const threadPromises = threadRecords.map(async threadRecord => {
      const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) : null;
      const author = rootPost.author;
      if (!author) {
        return null;
      }
      return adaptFeedToThread(author, threadRecord, rootPost);
    });

    const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

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
