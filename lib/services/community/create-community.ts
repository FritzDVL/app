"use server";

import { CreateCommunityFormData } from "@/hooks/forms/use-community-create-form";
import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community, Moderator } from "@/lib/domain/communities/types";
import { storageClient } from "@/lib/external/grove/client";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { lensChain } from "@/lib/external/lens/chain";
import { client } from "@/lib/external/lens/protocol-client";
import { persistCommunity } from "@/lib/external/supabase/communities";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { immutable } from "@lens-chain/storage-client";
import { Group, evmAddress } from "@lens-protocol/client";
import { createGroup, fetchAdminsFor, fetchGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { group } from "@lens-protocol/metadata";

export interface CreateCommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Creates a community using the full business logic
 * Orchestrates the entire community creation process
 */
export async function createCommunity(formData: CreateCommunityFormData): Promise<CreateCommunityResult> {
  try {
    // 1. Upload image if provided
    let iconUri;
    if (formData.logo) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(formData.logo, { acl });
      iconUri = uri;
    }

    // 2. Get admin session client
    const adminSessionClient = await getAdminSessionClient();

    // 3. Get admin wallet
    const adminWallet = await getAdminWallet();

    // 4. Prepare group name for metadata (no spaces, max 20 chars)
    const groupName = formData.name.replace(/\s+/g, "-").slice(0, 20);

    // 4. Build metadata for the group and upload it
    const groupMetadata = group({
      name: groupName,
      description: formData.description,
      ...(iconUri ? { icon: iconUri } : {}),
    });
    const acl = immutable(lensChain.id);
    const { uri } = await storageClient.uploadAsJson(groupMetadata, { acl });

    // 5. Create the group on Lens Protocol
    const result = await createGroup(adminSessionClient, {
      metadataUri: uri,
      admins: [evmAddress(formData.adminAddress), ADMIN_USER_ADDRESS],
      owner: evmAddress(formData.adminAddress),
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen((txHash: unknown) => {
        return fetchGroup(adminSessionClient, { txHash: txHash as string });
      });

    if (result.isErr() || !result.value) {
      let errMsg = "Failed to create group";
      if (result.isErr() && (result as any).error && typeof (result as any).error.message === "string") {
        errMsg = (result as any).error.message;
      }
      console.error("[Service] Error creating group:", errMsg, result);
      return {
        success: false,
        error: errMsg,
      };
    }

    const createdGroup = result.value as Group;

    // 6. Persist the community in Supabase
    const persistedCommunity = await persistCommunity(createdGroup.address, formData.name);

    // 7. Fetch moderators
    const adminsResult = await fetchAdminsFor(client, {
      address: evmAddress(createdGroup.address),
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

    // 8. Transform and return the new community
    const newCommunity = adaptGroupToCommunity(
      createdGroup,
      {
        totalMembers: 0,
        __typename: "GroupStatsResponse",
      },
      persistedCommunity,
      moderators,
    );

    return {
      success: true,
      community: newCommunity,
    };
  } catch (error) {
    console.error("Community creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create community",
    };
  }
}
