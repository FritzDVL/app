import { getThreadAuthor } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Address } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Account, Feed, Post } from "@lens-protocol/client";

/**
 * Transform a Lens Feed object and thread record to a Thread object
 * Optimized version that accepts pre-fetched root post to avoid redundant API calls
 */
export const adaptFeedToThread = async (
  feed: Feed,
  threadRecord: CommunityThreadSupabase,
  author: Account,
  rootPost: Post,
): Promise<Thread> => {
  return {
    id: threadRecord.id,
    feed,
    community: threadRecord.community.lens_group_address as Address,
    rootPost,
    author: getThreadAuthor(author),
    repliesCount: threadRecord.replies_count || 0,
    timeAgo: getTimeAgo(new Date(threadRecord.created_at)),
    isVisible: threadRecord.visible,
    created_at: threadRecord.created_at,
  };
};
