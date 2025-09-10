import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Account, Post } from "@lens-protocol/client";

export const adaptFeedToThread = async (
  author: Account,
  threadDb: CommunityThreadSupabase,
  rootPost: Post,
): Promise<Thread> => {
  const { title, summary } = getThreadTitleAndSummary(rootPost);

  return {
    id: threadDb.id,
    community: rootPost.feed.group?.address,
    rootPost,
    author: rootPost.author,
    repliesCount: rootPost.stats.comments || 0,
    isVisible: threadDb.visible,
    created_at: threadDb.created_at,
    title,
    summary,
    updatedAt: threadDb.updated_at,
  };
};

export const adaptExternalFeedToThread = async (rootPost: Post): Promise<Thread> => {
  const { title, summary } = getThreadTitleAndSummary(rootPost);
  return {
    id: `external-` + rootPost.id,
    community: rootPost.feed?.group?.address,
    rootPost,
    author: rootPost.author,
    repliesCount: rootPost.stats?.comments || 0,
    isVisible: true,
    created_at: rootPost.timestamp ? new Date(rootPost.timestamp).toISOString() : new Date().toISOString(),
    title,
    summary,
    updatedAt: rootPost.timestamp ? new Date(rootPost.timestamp).toISOString() : new Date().toISOString(),
    app: rootPost.app?.metadata?.name || "Other app",
  };
};
