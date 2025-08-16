/**
 * Get All Communities Service
 * Gets all communities using optimized batch operations
 */
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import { fetchGroupAdminsBatch, fetchGroupStatsBatch, fetchGroupsBatch } from "@/lib/external/lens/primitives/groups";
import { fetchAllCommunities } from "@/lib/external/supabase/communities";

export interface CommunitiesResult {
  success: boolean;
  communities?: Community[];
  error?: string;
}

export async function getAllCommunities(
  sortBy: keyof Community | null = null,
  sortOrder: "asc" | "desc" = "desc",
): Promise<CommunitiesResult> {
  try {
    // 1. Fetch all communities from database (single query)
    const dbCommunities = await fetchAllCommunities();
    if (!dbCommunities.length) {
      return {
        success: true,
        communities: [],
      };
    }

    // 2. Extract unique addresses for batching
    const communityAddresses = dbCommunities.map(community => community.lens_group_address);

    // 3. Batch fetch all data in parallel
    const [groupResults, statsResults, adminsResults] = await Promise.all([
      fetchGroupsBatch(communityAddresses),
      fetchGroupStatsBatch(communityAddresses),
      fetchGroupAdminsBatch(communityAddresses),
    ]);

    // 4. Create lookup maps for O(1) access
    const groupMap = new Map();
    groupResults.forEach(({ address, result }) => {
      groupMap.set(address, result);
    });

    const statsMap = new Map();
    statsResults.forEach(({ address, result }) => {
      statsMap.set(address, result);
    });

    const adminsMap = new Map();
    adminsResults.forEach(({ address, result }) => {
      adminsMap.set(address, result);
    });

    // 5. Transform communities using cached data
    const communitiesData: Community[] = [];
    for (const dbCommunity of dbCommunities) {
      try {
        const group = groupMap.get(dbCommunity.lens_group_address);
        const groupStats = statsMap.get(dbCommunity.lens_group_address);
        const moderators = adminsMap.get(dbCommunity.lens_group_address) || [];

        if (!group || !groupStats) {
          console.warn(`Missing data for community ${dbCommunity.lens_group_address}:`, {
            hasGroup: !!group,
            hasStats: !!groupStats,
          });
          continue;
        }

        communitiesData.push(adaptGroupToCommunity(group, groupStats, dbCommunity, moderators));
      } catch (error) {
        console.warn(`Error transforming community ${dbCommunity.lens_group_address}:`, error);
        continue;
      }
    }

    // Sort if requested
    if (sortBy) {
      communitiesData.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue === undefined || bValue === undefined) return 0;
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return {
      success: true,
      communities: communitiesData,
    };
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch communities",
    };
  }
}
