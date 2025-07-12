import { client } from "@/lib/clients/lens-protocol";
import { fetchCommunity as fetchCommunityDb } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Community, Moderator } from "@/types/common";
import { GroupStatsResponse, evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup, fetchGroupStats } from "@lens-protocol/client/actions";

/**
 * Fetches and transforms a single community by Lens group address.
 */
export async function fetchCommunity(address: string): Promise<Community | null> {
  try {
    // Run all three fetches in parallel
    const [groupResult, groupStatsResult, adminsResult] = await Promise.all([
      fetchGroup(client, { group: evmAddress(address) }),
      fetchGroupStats(client, { group: evmAddress(address) }),
      // We'll get group address from the group fetch, but for parallelism, use input address
      fetchAdminsFor(client, { address: evmAddress(address) }),
    ]);

    if (groupResult.isErr() || !groupResult.value) {
      console.warn(`Failed to fetch group ${address}:`, groupResult.isErr() ? groupResult.error.message : "No value");
      return null;
    }
    const group = groupResult.value;

    if (groupStatsResult.isErr()) {
      console.warn(`Failed to fetch group stats for ${address}:`, groupStatsResult.error.message);
      return null;
    }
    const groupStats = groupStatsResult.value as GroupStatsResponse;

    let moderators: Moderator[] = [];
    if (adminsResult.isOk()) {
      const admins = adminsResult.value.items;
      moderators = admins.map(admin => ({
        username: admin.account.username?.value || "",
        address: admin.account.address,
        picture: admin.account.metadata?.picture,
        displayName: admin.account.username?.localName || "",
      }));
    }

    // Fetch dbCommunity from Supabase (single fetch)
    const dbCommunity = await fetchCommunityDb(address);
    if (!dbCommunity) {
      console.warn(`No DB record found for group ${address}`);
      return null;
    }

    // Pass groupStats (not stats) to the transformer
    return transformGroupToCommunity(group, groupStats, dbCommunity, moderators);
  } catch (error) {
    console.warn(`Error populating community ${address}:`, error);
    return null;
  }
}
