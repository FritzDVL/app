import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsBatch, fetchPostsByFeed } from "@/lib/external/lens/primitives/posts";
import { fetchCommunityThreads, fetchThread } from "@/lib/external/supabase/threads";

export interface ThreadsResult {
  success: boolean;
  threads: Thread[];
  error?: string;
}

/**
 * Gets all threads for a community using optimized batch operations
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getCommunityThreads(
  community: Community,
  options?: { limit?: number; offset?: number; showAllPosts?: boolean },
): Promise<ThreadsResult> {
  try {
    const { limit = 10, offset = 0, showAllPosts = false } = options || {};

    if (showAllPosts) {
      // 1. Fetch latest posts in Lens for this group
      const lensResult = await fetchPostsByFeed(community.feed.address, undefined, { sort: "desc" });
      const lensPosts = lensResult.posts;
      // 2. Fetch threads in DB that match those posts
      const dbThreads = await Promise.all(lensPosts.map(post => fetchThread({ rootPostId: post.id })));
      // 3. Adapt and combine data
      const threadPromises = lensPosts.map(async (post, idx) => {
        const dbThread = dbThreads[idx];
        if (!dbThread) {
          // Placeholder for external Lens posts without DB record
          let title = "External Lens Post";
          let summary =
            "This post was created in another Lens app and does not have all LensForum data. You can read and reply, but some advanced features may be unavailable.";
          // Try to extract title/summary from known metadata types, or use first words of content
          if (post.metadata?.__typename === "ArticleMetadata") {
            if (post.metadata?.title) {
              title = post.metadata.title;
            } else if (post.metadata?.content) {
              title = post.metadata.content.split(" ").slice(0, 8).join(" ") + "...";
            }
            if (post.metadata?.content) {
              summary = post.metadata.content.split(" ").slice(0, 20).join(" ") + "...";
            }
          } else if (post.metadata?.__typename === "TextOnlyMetadata") {
            if (post.metadata?.content) {
              title = post.metadata.content.split(" ").slice(0, 8).join(" ") + "...";
              summary = post.metadata.content.split(" ").slice(0, 20).join(" ") + "...";
            }
          }
          // Pass placeholder DB thread to adaptFeedToThread
          const placeholderDbThread = {
            id: `external-${post.id}`,
            community: {
              id: community.id,
              name: community.name ?? "",
              feed: community.feed?.address ?? "",
              lens_group_address: community.group?.address ?? community.id,
              visible: true,
              created_at: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
              updated_at: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
            },
            lens_feed_address: community.feed?.address ?? "",
            title,
            summary,
            root_post_id: post.id,
            author: post.author?.address ?? "",
            created_at: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
            updated_at: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
            visible: true,
            replies_count: post.stats?.comments ?? 0,
            app: post.app?.metadata?.name,
          };
          return await adaptFeedToThread(post.author, placeholderDbThread, post);
        }
        return await adaptFeedToThread(post.author, dbThread, post);
      });
      const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];

      console.log("Fetched threads with showAllPosts:", threads);
      return { success: true, threads };
    } else {
      // 1. Fetch threads from DB
      const dbThreads = await fetchCommunityThreads(community.id, limit, offset);
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
      const threads = (await Promise.all(threadPromises)).filter(Boolean) as Thread[];
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
