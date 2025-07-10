import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchAllCommunities, fetchCommunity } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Address, Community, Moderator } from "@/types/common";
import { Group, GroupStatsResponse, evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup, fetchGroupStats, fetchGroups } from "@lens-protocol/client/actions";

type GroupResult = {
  address: string;
  result: Group | null;
};

type GroupStatsResult = {
  address: string;
  result: GroupStatsResponse | null;
};

type AdminsResult = {
  address: string;
  result: Moderator[];
};

/**
 * Optimized version that batches all Lens Protocol API calls for better performance.
 */
export async function fetchCommunities(
  sortBy: keyof Community | null = null,
  sortOrder: "asc" | "desc" = "desc",
): Promise<Community[]> {
  try {
    // 1. Fetch all communities from database (single query)
    const dbCommunities = await fetchAllCommunities();
    if (!dbCommunities.length) return [];

    // 2. Extract unique addresses for batching
    const communityAddresses = dbCommunities.map(community => evmAddress(community.lens_group_address));

    // 3. Batch fetch all groups in parallel
    const groupPromises = communityAddresses.map(address =>
      fetchGroup(client, { group: address }).then(result => ({
        address,
        result: result.isOk() ? result.value : null,
      })),
    );

    // 4. Batch fetch all group stats in parallel
    const statsPromises = communityAddresses.map(address =>
      fetchGroupStats(client, { group: address }).then(result => ({
        address,
        result: result.isOk() ? (result.value as GroupStatsResponse) : null,
      })),
    );

    // 5. Batch fetch all admins in parallel
    const adminsPromises = communityAddresses.map(address =>
      fetchAdminsFor(client, { address }).then(result => {
        const moderators: Moderator[] = result.isOk()
          ? result.value.items.map(admin => ({
              username: admin.account.username?.value || "",
              address: admin.account.address,
              picture: admin.account.metadata?.picture,
              displayName: admin.account.username?.localName || "",
            }))
          : [];
        return {
          address,
          result: moderators,
        };
      }),
    );

    // 6. Wait for all batched requests to complete
    const [groupResults, statsResults, adminsResults] = await Promise.all([
      Promise.all(groupPromises),
      Promise.all(statsPromises),
      Promise.all(adminsPromises),
    ]);

    // 7. Create lookup maps for O(1) access
    const groupMap = new Map<string, Group | null>();
    (groupResults as GroupResult[]).forEach(({ address, result }) => {
      groupMap.set(address, result);
    });

    const statsMap = new Map<string, GroupStatsResponse | null>();
    (statsResults as GroupStatsResult[]).forEach(({ address, result }) => {
      statsMap.set(address, result);
    });

    const adminsMap = new Map<string, Moderator[]>();
    (adminsResults as AdminsResult[]).forEach(({ address, result }) => {
      adminsMap.set(address, result);
    });

    // 8. Transform communities using cached data
    const communitiesData: Community[] = [];
    for (const dbCommunity of dbCommunities) {
      try {
        const address = evmAddress(dbCommunity.lens_group_address);
        const group = groupMap.get(address);
        const groupStats = statsMap.get(address);
        const moderators = adminsMap.get(address) || [];

        if (!group || !groupStats) {
          console.warn(`Missing data for community ${dbCommunity.lens_group_address}:`, {
            hasGroup: !!group,
            hasStats: !!groupStats,
          });
          continue;
        }

        communitiesData.push(transformGroupToCommunity(group, groupStats, dbCommunity, moderators));
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

    return communitiesData;
  } catch (error) {
    console.error("Failed to fetch communities (optimized):", error);
    throw error;
  }
}

/**
 * Fetches communities that a specific member has joined.
 * This function is already somewhat optimized as it uses the Lens API filter.
 */
export async function fetchCommunitiesJoined(member: Address): Promise<Community[]> {
  try {
    const result = await fetchGroups(client, {
      filter: {
        member: evmAddress(member),
      },
    });

    if (result.isErr()) {
      console.error(result.error);
      return [];
    }

    // items: Array<Group>
    const { items } = result.value;
    if (!items || items.length === 0) {
      return [];
    }

    // Extract unique addresses for batching
    const groupAddresses = items.map(group => evmAddress(group.address));

    // Batch fetch database communities
    const dbCommunitiesPromises = items.map(group => fetchCommunity(group.address));

    // Batch fetch group stats
    const statsPromises = groupAddresses.map(address =>
      fetchGroupStats(client, { group: address }).then(result => ({
        address,
        result: result.isOk() ? (result.value as GroupStatsResponse) : null,
      })),
    );

    // Batch fetch admins
    const adminsPromises = groupAddresses.map(address =>
      fetchAdminsFor(client, { address }).then(result => {
        const moderators: Moderator[] = result.isOk()
          ? result.value.items.map(admin => ({
              username: admin.account.username?.value || "",
              address: admin.account.address,
              picture: admin.account.metadata?.picture,
              displayName: admin.account.username?.localName || "",
            }))
          : [];
        return {
          address,
          result: moderators,
        };
      }),
    );

    // Wait for all batched requests to complete
    const [dbCommunities, statsResults, adminsResults] = await Promise.all([
      Promise.all(dbCommunitiesPromises),
      Promise.all(statsPromises),
      Promise.all(adminsPromises),
    ]);

    // Create lookup maps
    const statsMap = new Map<string, GroupStatsResponse | null>();
    (statsResults as GroupStatsResult[]).forEach(({ address, result }) => {
      statsMap.set(address, result);
    });

    const adminsMap = new Map<string, Moderator[]>();
    (adminsResults as AdminsResult[]).forEach(({ address, result }) => {
      adminsMap.set(address, result);
    });

    // Transform communities
    const communities: Community[] = [];
    for (let i = 0; i < items.length; i++) {
      const group = items[i];
      const dbCommunity = dbCommunities[i];

      if (!dbCommunity) {
        console.warn(`No database community found for group ${group.address}`);
        continue;
      }

      const groupStats = statsMap.get(evmAddress(group.address));
      if (!groupStats) {
        console.warn(`Failed to fetch stats for group ${group.address}`);
        continue;
      }

      const moderators = adminsMap.get(evmAddress(group.address)) || [];
      communities.push(transformGroupToCommunity(group, groupStats, dbCommunity, moderators));
    }

    return communities;
  } catch (error) {
    console.error("Error fetching joined communities:", error);
    return [];
  }
}
