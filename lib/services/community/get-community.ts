/**
 * Get Community Service
 * Gets a single community by address using service approach
 */
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import { fetchFeed } from "@/lib/external/lens/primitives/feeds";
import {
  fetchAdminsFromGroup,
  fetchGroupFromLens,
  fetchGroupStatsFromLens,
} from "@/lib/external/lens/primitives/groups";
import { fetchCommunity as fetchCommunityDb } from "@/lib/external/supabase/communities";
import { Address } from "@/types/common";
import { SessionClient } from "@lens-protocol/client";

export interface CommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Gets a single community by address using service approach
 */
export async function getCommunity(address: Address, sessionClient?: SessionClient): Promise<CommunityResult> {
  try {
    // Fetch database community
    const dbCommunity = await fetchCommunityDb(address);
    if (!dbCommunity) {
      return {
        success: false,
        error: "Community not found",
      };
    }

    // Fetch Lens data in parallel
    const [group, feed, groupStats, moderators] = await Promise.all([
      fetchGroupFromLens(address, sessionClient),
      fetchFeed(dbCommunity.feed as Address),
      fetchGroupStatsFromLens(address),
      fetchAdminsFromGroup(address),
    ]);

    if (!group || !groupStats || !feed) {
      return {
        success: false,
        error: "Failed to fetch community data from Lens Protocol",
      };
    }

    const community = adaptGroupToCommunity(group, feed, groupStats, dbCommunity, moderators);

    return {
      success: true,
      community,
    };
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community",
    };
  }
}
