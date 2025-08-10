/**
 * Get All Thread Replies Service
 * Gets all replies for a thread (non-paginated) using service approach
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { fetchAccountsBatch } from "@/lib/external/lens/primitives/accounts";
import { fetchAllThreadPosts } from "@/lib/external/lens/primitives/posts";

export interface RepliesResult {
  success: boolean;
  replies?: Reply[];
  error?: string;
}

/**
 * Gets all replies for a thread (non-paginated) using service approach
 */
export async function getAllThreadReplies(threadAddress: string): Promise<RepliesResult> {
  try {
    // 1. Fetch all posts for the thread
    const posts = await fetchAllThreadPosts(threadAddress);

    if (!posts.length) {
      return {
        success: true,
        replies: [],
      };
    }

    // 2. Extract unique author addresses for batching
    const authorAddresses = [...new Set(posts.map(post => post.author.address))];

    // 3. Batch fetch all authors
    const authorResults = await fetchAccountsBatch(authorAddresses);

    // 4. Create lookup map for O(1) access
    const authorMap = new Map();
    authorResults.forEach(({ address, result }) => {
      authorMap.set(address, result);
    });

    // 5. Transform posts to replies using cached author data
    const replies: Reply[] = [];
    for (const post of posts) {
      try {
        const author = authorMap.get(post.author.address);

        if (!author) {
          console.warn(`Missing author data for post ${post.id}:`, {
            authorAddress: post.author.address,
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
      replies,
    };
  } catch (error) {
    console.error("Failed to fetch all thread replies:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch all thread replies",
    };
  }
}
