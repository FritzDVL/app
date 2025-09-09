import { EditCommunityFormData } from "@/hooks/forms/use-community-edit-form";
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import { fetchAdminsFromGroup, fetchGroupStatsFromLens } from "@/lib/external/lens/primitives/groups";
import {
  fetchCommunity as fetchCommunityDb,
  updateCommunity as updateCommunityDb,
} from "@/lib/external/supabase/communities";
import { immutable } from "@lens-chain/storage-client";
import { Group, SessionClient } from "@lens-protocol/client";
import { fetchGroup, setGroupMetadata } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { group } from "@lens-protocol/metadata";
import { WalletClient } from "viem";

export interface UpdateCommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

export async function updateCommunity(
  community: Community,
  data: EditCommunityFormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<UpdateCommunityResult> {
  try {
    // 1. Upload new logo if provided
    let iconUri: string | undefined = undefined;
    if (data.logo) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(data.logo, { acl });
      iconUri = uri;
    }

    // 2. Prepare group name for metadata (no spaces, max 20 chars)
    const groupName = data.name ? data.name.replace(/\s+/g, "-").slice(0, 100) : "";

    // 3. Build new metadata
    const newMetadata = group({
      name: groupName,
      description: data.description,
      icon: iconUri ? iconUri : community.group.metadata?.icon,
    });

    // 4. Upload new metadata to Grove
    const acl = immutable(lensChain.id);
    const { uri: metadataUri } = await storageClient.uploadAsJson(newMetadata, { acl });

    // 5. Update group metadata on Lens
    const result = await setGroupMetadata(sessionClient, {
      group: community.group.address,
      metadataUri,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen(() => fetchGroup(sessionClient, { group: community.group.address }));

    if (result.isErr()) {
      return {
        success: false,
        error: result.error?.message || "Failed to update group metadata",
      };
    }
    const updatedGroup = result.value as Group;

    // 6. Update name and updatedAt in the database.
    if (updatedGroup) {
      await updateCommunityDb(community.group.address, data.name);
    }

    // 7. Fetch updated group stats, DB record, and moderators
    const [groupStats, dbCommunity, moderators] = await Promise.all([
      fetchGroupStatsFromLens(community.group.address),
      fetchCommunityDb(community.group.address),
      fetchAdminsFromGroup(community.group.address),
    ]);

    if (!dbCommunity || !groupStats) {
      return { success: false, error: "Error fetching updated data" };
    }
    const updatedCommunity = adaptGroupToCommunity(updatedGroup, groupStats, dbCommunity, moderators);
    return { success: true, community: updatedCommunity };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update community" };
  }
}
