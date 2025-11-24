import { adaptExternalFeedToThread, adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsBatch, fetchPostsByFeed } from "@/lib/external/lens/primitives/posts";
import { fetchCommunityThreads, fetchThread } from "@/lib/external/supabase/threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";

export interface ThreadsResult {
  success: boolean;
  threads: Thread[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  error?: string;
}

/**
 * Gets all threads for a community using optimized batch operations
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getCommunityThreads(
  community: Community,
  options?: { limit?: number; offset?: number; showAllPosts?: boolean; cursor?: string; tag?: string; search?: string },
): Promise<ThreadsResult> {
  try {
    const { limit = THREADS_PER_PAGE, offset = 0, showAllPosts = false, cursor = undefined } = options || {};

    if (showAllPosts) {
      // 1. Fetch latest posts in Lens for this group
      // Note: Lens API supports filtering by metadata tags, but we are using feed fetch here.
      // For now, we filter in memory if tag is provided.
      const lensResult = await fetchPostsByFeed(community.feed.address, undefined, { sort: "desc", limit, cursor });
      const lensPosts = lensResult.posts;
      // 2. Fetch threads in DB that match those posts
      const dbThreads = await Promise.all(lensPosts.map(post => fetchThread({ rootPostId: post.id })));
      // 3. Adapt and combine data
      const threadPromises = lensPosts.map(async (post, idx) => {
        const dbThread = dbThreads[idx];
        if (!dbThread) {
          // Use new adapter for external threads
          return adaptExternalFeedToThread(post as any);
        }
        return await adaptFeedToThread(post.author, dbThread, post);
      });
      let threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

      // Filter by tag if provided
      if (options?.tag) {
        threads = threads.filter(thread => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tags = (thread.rootPost.metadata as any)?.tags || [];
          return tags.includes(options.tag);
        });
      }

      return {
        success: true,
        threads,
        nextCursor: lensResult.pageInfo?.next ?? null,
        prevCursor: lensResult.pageInfo?.prev ?? null,
      };
    } else {
      // 1. Fetch threads from DB
      // If filtering by tag, we fetch more to increase chance of matches since we filter in memory
      const fetchLimit = options?.tag ? 50 : limit;
      const dbThreads = await fetchCommunityThreads(community.id, fetchLimit, offset, options?.search);

      // 2. Fetch posts in Lens for those threads
      const rootPostIds = dbThreads.map(t => t.root_post_id).filter((id): id is string => !!id);
      const lensPosts = await fetchPostsBatch(rootPostIds);

      // 3. Adapt and combine data
      const rootPostMap = new Map();
      lensPosts.forEach(post => {
        rootPostMap.set(post.id, post);
      });
      const threadPromises = dbThreads.map(async threadRecord => {
        const rootPost = threadRecord.root_post_id ? rootPostMap.get(threadRecord.root_post_id) : null;
        if (!rootPost || !rootPost.author) return null;
        return await adaptFeedToThread(rootPost.author, threadRecord, rootPost);
      });
      let threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

      // Filter by tag if provided
      if (options?.tag) {
        threads = threads.filter(thread => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tags = (thread.rootPost.metadata as any)?.tags || [];
          return tags.includes(options.tag);
        });
      }

      return { success: true, threads };
    }
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      threads: [],
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
}
