import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunity as fetchCommunityDb } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Community, Moderator } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup } from "@lens-protocol/client/actions";

/**
 * Fetches and transforms a single community by Lens group address.
 */
export async function fetchCommunity(address: string): Promise<Community | null> {
  try {
    // Fetch group from Lens Protocol
    const groupResult = await fetchGroup(client, {
      group: evmAddress(address),
    });
    if (groupResult.isErr() || !groupResult.value) {
      console.warn(`Failed to fetch group ${address}:`, groupResult.isErr() ? groupResult.error.message : "No value");
      return null;
    }
    const group = groupResult.value;

    // Fetch admins for the group
    const adminsResult = await fetchAdminsFor(client, {
      address: evmAddress(group.address),
    });
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

    return transformGroupToCommunity(group, dbCommunity, moderators);
  } catch (error) {
    console.warn(`Error populating community ${address}:`, error);
    return null;
  }
}
