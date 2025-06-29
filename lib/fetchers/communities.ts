import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchAllCommunities, fetchCommunity } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Address, Community, Moderator } from "@/types/common";
import { GroupStatsResponse, evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup, fetchGroupStats, fetchGroups } from "@lens-protocol/client/actions";

/**
 * Fetches communities from the database, enriches them with Lens Protocol data, and returns a Community[] array.
 */
export async function fetchCommunities(): Promise<Community[]> {
  const dbCommunities = await fetchAllCommunities();
  if (!dbCommunities.length) return [];

  const communitiesData: Community[] = [];

  for (const dbCommunity of dbCommunities) {
    try {
      // Parallelize all Lens Protocol fetches
      const [groupResult, groupStatsResult, adminsResult] = await Promise.all([
        fetchGroup(client, { group: evmAddress(dbCommunity.lens_group_address) }),
        fetchGroupStats(client, { group: evmAddress(dbCommunity.lens_group_address) }),
        fetchAdminsFor(client, { address: evmAddress(dbCommunity.lens_group_address) }),
      ]);
      if (groupResult.isErr()) {
        console.warn(`Failed to fetch group ${dbCommunity.lens_group_address}:`, groupResult.error.message);
        continue;
      }
      const group = groupResult.value;
      if (!group) {
        console.warn(`Group ${dbCommunity.lens_group_address} returned null`);
        continue;
      }
      if (groupStatsResult.isErr()) {
        console.warn(
          `Failed to fetch group stats for ${dbCommunity.lens_group_address}:`,
          groupStatsResult.error.message,
        );
        continue;
      }
      const groupStats = groupStatsResult.value as GroupStatsResponse;
      if (adminsResult.isOk()) {
        const admins = adminsResult.value.items;
        const transformedModerators: Moderator[] = admins.map(admin => ({
          username: admin.account.username?.value || "",
          address: admin.account.address,
          picture: admin.account.metadata?.picture,
          displayName: admin.account.username?.localName || "",
        }));
        communitiesData.push(transformGroupToCommunity(group, groupStats, dbCommunity, transformedModerators));
      }
    } catch (groupError) {
      console.warn(`Error fetching group ${dbCommunity.lens_group_address}:`, groupError);
      continue;
    }
  }
  return communitiesData;
}

export async function fetchCommunitiesJoined(member: Address, limit = 10): Promise<Community[]> {
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
    const { items, pageInfo } = result.value;
    if (!items || items.length === 0) {
      return [];
    }
    const communities: Community[] = [];
    for (const group of items) {
      const dbCommunity = await fetchCommunity(group.address);
      if (!dbCommunity) {
        console.warn(`No database community found for group ${group.address}`);
        continue;
      }

      const groupStatsResult = await fetchGroupStats(client, { group: evmAddress(group.address) });
      if (groupStatsResult.isErr()) {
        console.error(`Failed to fetch stats for group ${group.address}:`, groupStatsResult.error);
        continue;
      }
      const groupStats = groupStatsResult.value as GroupStatsResponse;

      const adminsResult = await fetchAdminsFor(client, { address: evmAddress(group.address) });
      let moderators: Moderator[] = [];
      if (adminsResult.isOk()) {
        moderators = adminsResult.value.items.map(admin => ({
          username: admin.account.username?.value || "",
          address: admin.account.address,
          picture: admin.account.metadata?.picture,
          displayName: admin.account.username?.localName || "",
        }));
      }

      communities.push(transformGroupToCommunity(group, groupStats, dbCommunity, moderators));
    }
    return communities;
  } catch (error) {
    console.error("Error fetching joined communities:", error);
    return [];
  }
}
