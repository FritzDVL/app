import { getThreadAuthor } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Account, Post } from "@lens-protocol/client";

/**
 * Transform a Lens Feed object and thread record to a Thread object
 * Optimized version that accepts pre-fetched root post to avoid redundant API calls
 */
export const adaptFeedToThread = async (author: Account, rootPost: Post): Promise<Thread> => {
  return {
    id: rootPost.id,
    community: rootPost.feed.group?.address,
    rootPost,
    author: getThreadAuthor(author),
    repliesCount: rootPost.stats.comments || 0,
    timeAgo: getTimeAgo(new Date(rootPost.timestamp)),
    isVisible: rootPost.isDeleted ? false : true,
    created_at: rootPost.timestamp,
  };
};
