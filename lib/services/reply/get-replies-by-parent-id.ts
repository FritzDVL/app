/**
 * Get Replies By Parent ID Service
 * Gets replies by parent ID using service approach
 */
import { RepliesResult, getAllThreadReplies } from "./get-all-thread-replies";

/**
 * Gets replies by parent ID using service approach
 */
export async function getRepliesByParentId(parentId: string, threadAddress?: string): Promise<RepliesResult> {
  try {
    if (!threadAddress) {
      return {
        success: true,
        replies: [],
      };
    }

    // Get all thread replies first
    const result = await getAllThreadReplies(threadAddress);
    if (!result.success || !result.replies) {
      return result;
    }

    // Filter by parent ID
    const filteredReplies = result.replies.filter(r => r.parentReplyId === parentId);

    return {
      success: true,
      replies: filteredReplies,
    };
  } catch (error) {
    console.error("Failed to fetch replies by parent ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch replies by parent ID",
    };
  }
}
