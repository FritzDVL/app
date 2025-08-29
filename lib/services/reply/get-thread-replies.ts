/**
 * Get Thread Replies Service
 * Gets replies for a thread with pagination using service approach
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { fetchPostsByFeed } from "@/lib/external/lens/primitives/posts";
import { PageSize } from "@lens-protocol/client";

export interface PaginatedRepliesResult {
  success: boolean;
  data?: {
    replies: Reply[];
    pageInfo: any;
  };
  error?: string;
}

/**
 * Gets replies for a thread with pagination using service approach
 */
export async function getThreadReplies(
  thread: Thread,
  pageSize: PageSize = PageSize.Fifty,
  cursor?: string | null,
): Promise<PaginatedRepliesResult> {
  try {
    // 1. Fetch posts with pagination
    const { posts, pageInfo } = await fetchPostsByFeed(thread.feed.address, pageSize, cursor);

    if (!posts.length) {
      return {
        success: true,
        data: {
          replies: [],
          pageInfo,
        },
      };
    }

    // 2. Transform posts to replies using author data from post.author
    let replies: Reply[] = [];
    for (const post of posts) {
      try {
        const author = post.author;
        if (!author) {
          console.warn(`Missing author data for post ${post.id}:`, {
            authorAddress: post.author?.address,
          });
          continue;
        }
        replies.push(
          adaptPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
            address: author.address,
          }),
        );
      } catch (error) {
        console.warn(`Error transforming post ${post.id}:`, error);
        continue;
      }
    }

    // Filter the rootPost if it exists
    if (thread.rootPost && typeof thread.rootPost.id === "string") {
      replies = replies.filter(r => r.id !== thread.rootPost!.id);
    }

    return {
      success: true,
      data: {
        replies,
        pageInfo,
      },
    };
  } catch (error) {
    console.error("Failed to fetch thread replies:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch thread replies",
    };
  }
}
