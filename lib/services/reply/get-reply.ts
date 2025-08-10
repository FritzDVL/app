/**
 * Get Reply Service
 * Gets a single reply by ID using service approach
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { fetchAccountsBatch } from "@/lib/external/lens/primitives/accounts";
import { client } from "@/lib/external/lens/protocol-client";
import { Reply } from "@/types/common";
import { Post, postId } from "@lens-protocol/client";
import { fetchPost } from "@lens-protocol/client/actions";

/**
 * Gets a single reply by ID using service approach
 */
export async function getReply(replyId: string): Promise<{
  success: boolean;
  reply?: Reply;
  error?: string;
}> {
  try {
    const result = await fetchPost(client, { post: postId(replyId) });

    if (!result.isOk() || !result.value) {
      return {
        success: false,
        error: "Reply not found",
      };
    }

    const post = result.value as Post;
    if (!post.author || !post.author.address) {
      return {
        success: false,
        error: "Invalid reply data",
      };
    }

    // Fetch author account
    const authorResults = await fetchAccountsBatch([post.author.address]);
    const author = authorResults[0]?.result;

    if (!author) {
      return {
        success: false,
        error: "Author not found",
      };
    }

    const reply = adaptPostToReply(post, {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
      address: author.address,
    });

    return {
      success: true,
      reply,
    };
  } catch (error) {
    console.error("Failed to fetch reply:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reply",
    };
  }
}
