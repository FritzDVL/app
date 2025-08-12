/**
 * Get Latest Replies By Author Service
 * Gets latest replies by author using service approach
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { fetchPostsByAuthor } from "@/lib/external/lens/primitives/posts";
import { Address } from "@/types/common";

export interface RepliesResult {
  success: boolean;
  replies?: Reply[];
  error?: string;
}

/**
 * Gets latest replies by author using service approach
 */
export async function getLatestRepliesByAuthor(author: Address, limit: number = 10): Promise<RepliesResult> {
  try {
    // 1. Fetch latest posts by author
    const posts = await fetchPostsByAuthor(author, limit);

    if (!posts.length) {
      return {
        success: true,
        replies: [],
      };
    }

    // 2. Transform posts to replies (author info is already available in posts)
    const replies: Reply[] = [];
    for (const post of posts) {
      try {
        replies.push(
          adaptPostToReply(post, {
            name: post.author.username?.localName || "Unknown Author",
            username: post.author.username?.value || "unknown",
            avatar: post.author.metadata?.picture || "",
            reputation: post.author.score || 0,
            address: post.author.address,
          }),
        );
      } catch (error) {
        console.warn(`Error transforming post ${post.id}:`, error);
        continue;
      }
    }

    return {
      success: true,
      replies,
    };
  } catch (error) {
    console.error("Failed to fetch latest replies by author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch latest replies by author",
    };
  }
}
