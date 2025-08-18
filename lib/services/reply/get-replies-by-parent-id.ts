import { RepliesResult } from "./get-latest-replies-by-author";
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { fetchCommentsByPostId } from "@/lib/external/lens/primitives/posts";
import { PostId } from "@lens-protocol/client";

/**
 * Gets replies by parent ID using service approach
 */
export async function getRepliesByParentId(parentId: PostId): Promise<RepliesResult> {
  try {
    // 1. Fetch all posts for the thread
    const posts = await fetchCommentsByPostId(parentId);
    if (!posts.length) {
      return {
        success: true,
        replies: [],
      };
    }

    // 2. Transform posts to replies using author data from post.author
    const replies: Reply[] = [];
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

    return {
      success: true,
      replies: replies,
    };
  } catch (error) {
    console.error("Failed to fetch replies by parent ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch replies by parent ID",
    };
  }
}
