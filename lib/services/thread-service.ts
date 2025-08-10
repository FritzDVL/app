/**
 * Thread Service
 * Orchestrates thread operations using existing API, hooks and external layer
 */
import { adaptFeedToThread, adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { fetchAccountFromLens, fetchAccountsBatch } from "@/lib/external/lens/primitives/accounts";
import { fetchFeedFromLens, fetchFeedsBatch } from "@/lib/external/lens/primitives/feeds";
import { fetchPostsBatch } from "@/lib/external/lens/primitives/posts";
import {
  fetchCommunityThreads,
  fetchFeaturedThreads as fetchFeaturedThreadsDb,
  fetchLatestThreads as fetchLatestThreadsDb,
  fetchThread as fetchThreadDb,
} from "@/lib/external/supabase/threads";
import { Thread } from "@/types/common";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

export interface ThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Creates a thread using the existing API endpoint
 * Based on the logic in use-thread-create.ts hook
 */
export async function createThread(
  communityAddress: string,
  formData: CreateThreadFormData,
): Promise<CreateThreadResult> {
  try {
    const response = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        communityAddress,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        tags: formData.tags || "",
        author: formData.author,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Failed to create thread",
      };
    }

    return {
      success: true,
      // Note: API doesn't return thread object, would need additional logic
      // to fetch and transform the created thread
    };
  } catch (error) {
    console.error("Thread creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread",
    };
  }
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
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
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
    console.error("Failed to fetch featured threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured threads",
    };
  }
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
