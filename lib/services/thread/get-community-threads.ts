import { adaptFeedToThread } from "@/lib/adapters/thread-adapter";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsByFeed } from "@/lib/external/lens/primitives/posts";

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Gets all threads for a community using optimized batch operations
 * Orchestrates database, Lens Protocol calls, and data transformation
 */
export async function getCommunityThreads(community: Community): Promise<ThreadsResult> {
  try {
    // 1. Fetch posts for the community feed
    const { posts } = await fetchPostsByFeed(community.feed.address);

    // 2. Transform posts into threads
    const threads = await Promise.all(
      posts.map(async post => {
        // Use the community object, post.author, and post
        return adaptFeedToThread(post.author, post);
      }),
    );

    return {
      success: true,
      threads: threads.filter(Boolean) as Thread[],
    };
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
}
