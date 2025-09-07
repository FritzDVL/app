import { Community, Moderator } from "@/lib/domain/communities/types";
import { CommunitySupabase } from "@/types/supabase";
import { Feed, Group, GroupStatsResponse } from "@lens-protocol/client";

/**
 * Transform a Lens Group object to a Community object
 */
export function adaptGroupToCommunity(
  group: Group,
  feed: Feed,
  groupStats: GroupStatsResponse,
  dbCommunity: CommunitySupabase,
  moderators: Moderator[],
): Community {
  const createdAt = group.timestamp ? new Date(group.timestamp).toISOString() : new Date().toISOString();

  return {
    id: dbCommunity.id,
    name: dbCommunity.name || group.metadata?.name || "",
    group,
    feed,
    moderators,
    memberCount: groupStats.totalMembers || 0,
    threadsCount: dbCommunity.threads_count || 0,
    isVisible: dbCommunity.visible,
    createdAt,
  };
}
