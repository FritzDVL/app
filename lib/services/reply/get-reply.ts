/**
 * Get Reply Service
 * Gets a single reply by ID using service approach
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { Reply } from "@/lib/domain/replies/types";
import { client } from "@/lib/external/lens/protocol-client";
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

    const reply = adaptPostToReply(post);

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
