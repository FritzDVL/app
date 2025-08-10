/**
 * Community Service
 * Orchestrates community operations using existing API and external layer
 */
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { CreateCommunityFormData } from "@/lib/domain/communities/types";
import {
  fetchGroupAdminsBatch,
  fetchGroupAdminsFromLens,
  fetchGroupFromLens,
  fetchGroupStatsBatch,
  fetchGroupStatsFromLens,
  fetchGroupsBatch,
  fetchGroupsByFilter,
} from "@/lib/external/lens/primitives/communities";
import {
  fetchAllCommunities,
  fetchCommunity as fetchCommunityDb,
  fetchFeaturedCommunities,
} from "@/lib/external/supabase/communities";
import { Address, Community } from "@/types/common";

export interface CreateCommunityResult {
  success: boolean;
  community?: any;
  error?: string;
}

export interface CommunitiesResult {
  success: boolean;
  communities?: Community[];
  error?: string;
}

export interface CommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Creates a community using the existing API endpoint
 * Based on the logic in community-create-form.tsx component
 */
export async function createCommunity(
  formData: CreateCommunityFormData,
  imageFile?: File,
): Promise<CreateCommunityResult> {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("adminAddress", formData.adminAddress);

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    const response = await fetch("/api/communities", {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || "Failed to create community",
      };
    }

    return {
      success: true,
      community: result.community,
    };
  } catch (error) {
    console.error("Community creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create community",
    };
  }
}

/**
 * Gets all communities using optimized batch operations
 * Replaces the fetchCommunities function with service-based approach
 */
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

/**
 * Gets a single community by address using service approach
 */
export async function getCommunity(address: string): Promise<CommunityResult> {
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
    const [group, groupStats, moderators] = await Promise.all([
      fetchGroupFromLens(address),
      fetchGroupStatsFromLens(address),
      fetchGroupAdminsFromLens(address),
    ]);

    if (!group || !groupStats) {
      return {
        success: false,
        error: "Failed to fetch community data from Lens Protocol",
      };
    }

    const community = adaptGroupToCommunity(group, groupStats, dbCommunity, moderators);

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

/**
 * Gets communities that a specific member has joined using optimized batch operations
 */
export async function getCommunitiesJoined(member: Address): Promise<CommunitiesResult> {
  try {
    // 1. Fetch groups from Lens using member filter
    const groups = await fetchGroupsByFilter({ member });
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
