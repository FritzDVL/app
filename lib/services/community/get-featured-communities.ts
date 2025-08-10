/**
 * Get Featured Communities Service
 * Gets featured communities using service approach
 */
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { fetchGroupAdminsBatch, fetchGroupStatsBatch, fetchGroupsBatch } from "@/lib/external/lens/primitives/groups";
import { fetchFeaturedCommunities } from "@/lib/external/supabase/communities";
import { Community } from "@/types/common";

export interface CommunitiesResult {
  success: boolean;
  communities?: Community[];
  error?: string;
}

/**
 * Gets featured communities using service approach
 */
export async function getFeaturedCommunities(): Promise<CommunitiesResult> {
  try {
    // Get featured community records from database
    const dbCommunities = await fetchFeaturedCommunities();

    if (!dbCommunities.length) {
      return {
        success: true,
        communities: [],
      };
    }

    // Extract addresses for batch operations
    const addresses = dbCommunities.map(c => c.lens_group_address);

    // Batch fetch all data in parallel
    const [groupResults, statsResults, adminsResults] = await Promise.all([
      fetchGroupsBatch(addresses),
      fetchGroupStatsBatch(addresses),
      fetchGroupAdminsBatch(addresses),
    ]);

    // Create lookup maps
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

    // Transform communities
    const featuredCommunities: Community[] = [];
    for (const dbCommunity of dbCommunities) {
      const group = groupMap.get(dbCommunity.lens_group_address);
      const groupStats = statsMap.get(dbCommunity.lens_group_address);
      const moderators = adminsMap.get(dbCommunity.lens_group_address) || [];

      if (group && groupStats) {
        featuredCommunities.push(adaptGroupToCommunity(group, groupStats, dbCommunity, moderators));
      }
    }

    return {
      success: true,
      communities: featuredCommunities,
    };
  } catch (error) {
    console.error("Failed to fetch featured communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured communities",
    };
  }
}
