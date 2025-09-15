import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import { fetchGroupAdminsBatch, fetchGroupStatsBatch, fetchGroupsBatch } from "@/lib/external/lens/primitives/groups";
import { fetchCommunities } from "@/lib/external/supabase/communities";

export interface CommunitiesResult {
  success: boolean;
  communities: Community[];
  error?: string;
}

export interface GetCommunitiesOptions {
  sort?: { by: keyof Community; order: "asc" | "desc" };
  limit?: number;
  offset?: number;
}

export async function getCommunitiesPaginated(options: GetCommunitiesOptions = {}): Promise<CommunitiesResult> {
  const { sort, limit, offset } = options;
  const sortBy = sort?.by ?? null;
  const sortOrder = sort?.order ?? "desc";
  try {
    // 1. Fetch communities from database with pagination
    const dbCommunities = await fetchCommunities(limit, offset);
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
      communities: [],
      error: error instanceof Error ? error.message : "Failed to fetch communities",
    };
  }
}
