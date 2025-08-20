/**
 * Get Communities Joined Service
 * Gets communities that a specific member has joined using optimized batch operations
 */
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import {
  fetchGroupAdminsBatch,
  fetchGroupStatsBatch,
  fetchGroupsJoinedByMember,
} from "@/lib/external/lens/primitives/groups";
import { fetchCommunity as fetchCommunityDb } from "@/lib/external/supabase/communities";
import { Address } from "@/types/common";

export interface CommunitiesResult {
  success: boolean;
  communities?: Community[];
  error?: string;
}

/**
 * Gets communities that a specific member has joined using optimized batch operations
 */
export async function getCommunitiesJoined(member: Address): Promise<CommunitiesResult> {
  try {
    // 1. Fetch groups from Lens using member filter
    const groups = await fetchGroupsJoinedByMember(member);
    if (!groups.length) {
      return {
        success: true,
        communities: [],
      };
    }

    // 2. Extract addresses for batching
    const groupAddresses = groups.map(group => group.address);

    // 3. Batch fetch all data in parallel
    const [dbCommunitiesPromises, statsResults, adminsResults] = await Promise.all([
      Promise.all(groups.map(group => fetchCommunityDb(group.address))),
      fetchGroupStatsBatch(groupAddresses),
      fetchGroupAdminsBatch(groupAddresses),
    ]);

    // 4. Create lookup maps
    const statsMap = new Map();
    statsResults.forEach(({ address, result }) => {
      statsMap.set(address, result);
    });

    const adminsMap = new Map();
    adminsResults.forEach(({ address, result }) => {
      adminsMap.set(address, result);
    });

    // 5. Transform communities
    const communities: Community[] = [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const dbCommunity = dbCommunitiesPromises[i];

      if (!dbCommunity) {
        console.warn(`No database community found for group ${group.address}`);
        continue;
      }

      const groupStats = statsMap.get(group.address);
      if (!groupStats) {
        console.warn(`Failed to fetch stats for group ${group.address}`);
        continue;
      }

      const moderators = adminsMap.get(group.address) || [];
      communities.push(adaptGroupToCommunity(group, groupStats, dbCommunity, moderators));
    }

    return {
      success: true,
      communities,
    };
  } catch (error) {
    console.error("Failed to fetch joined communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch joined communities",
    };
  }
}
