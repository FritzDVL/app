import { adaptFeedToThreadOptimized } from "@/lib/adapters/thread-adapter";
import { client } from "@/lib/external/lens/protocol-client";
import { fetchCommunityThreads, fetchFeaturedThreads, fetchLatestThreads } from "@/lib/external/supabase/threads";
import { Thread } from "@/types/common";
import { Account, Feed, Post, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchFeed, fetchPost } from "@lens-protocol/client/actions";

/**
 * Fetches all threads for a given community address, enriches them with Lens Protocol data, and returns a Thread[] array.
 * Now optimized with batched API calls for better performance.
 * @param communityAddress - The Lens Protocol community address
 */
export async function fetchThreads(communityAddress: string): Promise<Thread[]> {
  try {
    // Get thread records from database
    const threadRecords = await fetchCommunityThreads(communityAddress);
    return await fetchThreadsBatched(threadRecords);
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    throw error;
  }
}

type FeedResult = {
  address: string;
  result: Feed | null;
};

type AuthorResult = {
  address: string;
  result: Account | null;
};

type RootPostResult = {
  postId: string;
  result: Post | null;
};

/**
 * Generic batched thread fetcher that optimizes Lens Protocol API calls
 * @param threadRecords - Array of thread records from database
 * @returns Promise<Thread[]>
 */
async function fetchThreadsBatched(threadRecords: any[]): Promise<Thread[]> {
  if (!threadRecords.length) return [];

  // 1. Extract unique addresses for batching
  const feedAddresses = threadRecords.map(record => evmAddress(record.lens_feed_address));
  const authorAddresses = [...new Set(threadRecords.map(record => evmAddress(record.author)))];
  const rootPostIds = threadRecords.map(record => record.root_post_id).filter((id): id is string => id !== null);

  // 2. Batch fetch all feeds in parallel
  const feedPromises = feedAddresses.map(address =>
    fetchFeed(client, { feed: address }).then(result => ({
      address,
      result: result.isOk() ? result.value : null,
    })),
  );

  // 3. Batch fetch all unique authors in parallel
  const authorPromises = authorAddresses.map(address =>
    fetchAccount(client, { address }).then(result => ({
      address,
      result: result.isOk() ? result.value : null,
    })),
  );

  // 4. Batch fetch all root posts in parallel
  const rootPostPromises = rootPostIds.map(postId =>
    fetchPost(client, { post: postId }).then(result => ({
      postId,
      result: result.isOk() ? result.value : null,
    })),
  );

  // 5. Wait for all batched requests to complete
  const [feedResults, authorResults, rootPostResults] = await Promise.all([
    Promise.all(feedPromises),
    Promise.all(authorPromises),
    Promise.all(rootPostPromises),
  ]);

  // 6. Create lookup maps for O(1) access
  const feedMap = new Map<string, Feed | null>();
  (feedResults as FeedResult[]).forEach(({ address, result }) => {
    feedMap.set(address, result);
  });

  const authorMap = new Map<string, Account | null>();
  (authorResults as AuthorResult[]).forEach(({ address, result }) => {
    authorMap.set(address, result);
  });

  const rootPostMap = new Map<string, Post | null>();
  (rootPostResults as RootPostResult[]).forEach(({ postId, result }) => {
    rootPostMap.set(postId, result);
  });

  // 7. Transform threads using cached data
  const threads: Thread[] = [];
  for (const threadRecord of threadRecords) {
    try {
      const feed = feedMap.get(evmAddress(threadRecord.lens_feed_address));
      const author = authorMap.get(evmAddress(threadRecord.author));

      if (!feed || !author) {
        console.warn(`Missing data for thread ${threadRecord.lens_feed_address}:`, {
          hasFeed: !!feed,
          hasAuthor: !!author,
        });
        continue;
      }

      // Get root post if available
      const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) || null : null;

      const thread = await adaptFeedToThreadOptimized(feed, threadRecord, author, rootPost);
      threads.push(thread);
    } catch (error) {
      console.warn(`Error transforming thread ${threadRecord.lens_feed_address}:`, error);
      continue;
    }
  }

  return threads;
}

/**
 * Optimized version of latest threads fetcher that batches Lens Protocol API calls
 * for better performance on the home page.
 */
export async function fetchLatestThreadsOptimized(limit: number = 5): Promise<Thread[]> {
  try {
    // 1. Fetch thread records from database (single query)
    const threadRecords = await fetchLatestThreads(limit);
    return await fetchThreadsBatched(threadRecords);
  } catch (error) {
    console.error("Failed to fetch latest threads (optimized):", error);
    throw error;
  }
}

/**
 * Optimized version of featured threads fetcher that batches Lens Protocol API calls
 * for better performance.
 */
export async function fetchFeaturedThreadsOptimized(limit: number = 5): Promise<Thread[]> {
  try {
    // 1. Fetch featured thread records from database (single query)
    const threadRecords = await fetchFeaturedThreads(limit);
    return await fetchThreadsBatched(threadRecords);
  } catch (error) {
    console.error("Failed to fetch featured threads (optimized):", error);
    throw error;
  }
}
