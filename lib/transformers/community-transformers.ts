import { Community, Moderator } from "@/types/common";
import { CommunitySupabase } from "@/types/supabase";
import { Group, GroupStatsResponse } from "@lens-protocol/client";

/**
 * Transform a Lens Group object to a Community object
 */
export function transformGroupToCommunity(
  group: Group,
  groupStats: GroupStatsResponse,
  dbCommunity: CommunitySupabase,
  moderators: Moderator[],
): Community {
  const groupTimestamp = group.timestamp ? new Date(group.timestamp).toISOString() : new Date().toISOString();

  return {
    id: dbCommunity.id,
    address: group.address,
    name: dbCommunity.name || "",
    description: group.metadata?.description || "",
    logo: group.metadata?.icon || null,
    memberCount: groupStats.totalMembers || 0,
    threadsCount: 0,
    moderators,
    createdAt: groupTimestamp,
  };
}
