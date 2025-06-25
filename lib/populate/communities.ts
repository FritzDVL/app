import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchAllCommunities } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Community, Moderator } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup } from "@lens-protocol/client/actions";

/**
 * Fetches communities from the database, enriches them with Lens Protocol data, and returns a Community[] array.
 */
export async function populateCommunities(): Promise<Community[]> {
  // Get community records from database
  const dbCommunities = await fetchAllCommunities();
  if (!dbCommunities.length) return [];

  const communitiesData: Community[] = [];

  for (const dbCommunity of dbCommunities) {
    try {
      const groupResult = await fetchGroup(client, {
        group: evmAddress(dbCommunity.lens_group_address),
      });
      if (groupResult.isErr()) {
        console.warn(`Failed to fetch group ${dbCommunity.lens_group_address}:`, groupResult.error.message);
        continue;
      }
      const group = groupResult.value;
      if (!group) {
        console.warn(`Group ${dbCommunity.lens_group_address} returned null`);
        continue;
      }

      // Fetch admins for the group
      const adminsResult = await fetchAdminsFor(client, {
        address: evmAddress(group.address),
      });

      if (adminsResult.isOk()) {
        const admins = adminsResult.value.items;
        const transformedModerators: Moderator[] = admins.map(admin => ({
          username: admin.account.username?.value || "",
          address: admin.account.address,
          picture: admin.account.metadata?.picture,
          displayName: admin.account.username?.localName || "",
        }));
        communitiesData.push(transformGroupToCommunity(group, dbCommunity, transformedModerators));
      }
    } catch (groupError) {
      console.warn(`Error fetching group ${dbCommunity.lens_group_address}:`, groupError);
      continue;
    }
  }
  return communitiesData;
}
