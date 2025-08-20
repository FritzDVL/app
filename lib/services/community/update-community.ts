"use server";

import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import { storageClient } from "@/lib/external/grove/client";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { lensChain } from "@/lib/external/lens/chain";
import { fetchAdminsFromGroup, fetchGroupStatsFromLens } from "@/lib/external/lens/primitives/groups";
import {
  fetchCommunity as fetchCommunityDb,
  updateCommunity as updateCommunityDb,
} from "@/lib/external/supabase/communities";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { Address } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { Group, evmAddress } from "@lens-protocol/client";
import { fetchGroup, setGroupMetadata } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";

export interface UpdateCommunityFormData {
  name?: string;
  description?: string;
  logo?: File | null;
}

export async function updateCommunity(
  address: Address,
  data: UpdateCommunityFormData,
): Promise<{ success: boolean; community?: Community; error?: string }> {
  try {
    // 1. Upload new logo if provided
    let iconUri: string | undefined = undefined;
    if (data.logo) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(data.logo, { acl });
      iconUri = uri;
    }

    // 2. Get admin session client and wallet
    const adminSessionClient = await getAdminSessionClient();
    const adminWallet = await getAdminWallet();

    // 3. Fetch current group from Lens
    const groupResult = await fetchGroup(adminSessionClient, { group: evmAddress(address) });
    if (groupResult.isErr() || !groupResult.value) {
      return { success: false, error: "Failed to fetch group from Lens" };
    }
    const group = groupResult.value;

    // 4. Build new metadata
    const newMetadata = {
      ...group.metadata,
      ...(data.name ? { name: data.name } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(iconUri ? { icon: iconUri } : {}),
    };

    // 5. Upload new metadata to Grove
    const acl = immutable(lensChain.id);
    const { uri: metadataUri } = await storageClient.uploadAsJson(newMetadata, { acl });

    // 6. Update group metadata on Lens
    const updateResult = await setGroupMetadata(adminSessionClient, {
      group: evmAddress(address),
      metadataUri,
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen((txHash: unknown) => {
        return fetchGroup(adminSessionClient, { txHash: txHash as string });
      });
    if (updateResult.isErr()) {
      return {
        success: false,
        error: updateResult.error?.message || "Failed to update group metadata",
      };
    }

    const updatedGroup = updateResult.value as Group;

    // 6.5. Update name and updatedAt in the database.
    if (data.name) {
      await updateCommunityDb(address, data.name);
    }

    // 7. Fetch updated group stats, DB record, and moderators
    const [groupStatsRaw, dbCommunity, moderators] = await Promise.all([
      fetchGroupStatsFromLens(address),
      fetchCommunityDb(address),
      fetchAdminsFromGroup(address),
    ]);
    const groupStats = groupStatsRaw ?? { __typename: "GroupStatsResponse", totalMembers: 0 };
    if (!dbCommunity) {
      return { success: false, error: "Community database record not found" };
    }
    const updatedCommunity = adaptGroupToCommunity(updatedGroup, groupStats, dbCommunity, moderators);
    return { success: true, community: updatedCommunity };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update community" };
  }
}
