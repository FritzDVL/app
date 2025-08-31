import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community, Moderator } from "@/lib/domain/communities/types";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import { client } from "@/lib/external/lens/protocol-client";
import { persistCommunity } from "@/lib/external/supabase/communities";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { Address } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { Group, SessionClient, evmAddress } from "@lens-protocol/client";
import { createGroup, fetchAdminsFor, fetchGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { group } from "@lens-protocol/metadata";
import { WalletClient } from "viem";

export interface CreateCommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Creates a community using the full business logic
 * Orchestrates the entire community creation process
 */
export async function createCommunity(
  formData: FormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<CreateCommunityResult> {
  try {
    // 1. Upload image if provided
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const adminAddress = formData.get("adminAddress") as Address;
    const logoFile = formData.get("logo") as File | null;
    const communityRule = formData.get("communityRule");
    let parsedCommunityRule = communityRule ? JSON.parse(communityRule as string) : undefined;
    if (parsedCommunityRule && typeof parsedCommunityRule === "object" && "type" in parsedCommunityRule) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...rest } = parsedCommunityRule;
      parsedCommunityRule = rest;
    }

    let iconUri;
    if (logoFile) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(logoFile, { acl });
      iconUri = uri;
    }

    // 2. Get admin session client
    // const adminSessionClient = await getAdminSessionClient();
    const adminSessionClient = sessionClient;

    // 3. Get admin wallet
    // const adminWallet = await getAdminWallet();
    const adminWallet = walletClient;

    // 4. Prepare group name for metadata (no spaces, max 20 chars)
    const groupName = name.replace(/\s+/g, "-").slice(0, 20);

    // 4. Build metadata for the group and upload it
    const groupMetadata = group({
      name: groupName,
      description: description,
      ...(iconUri ? { icon: iconUri } : {}),
    });
    const acl = immutable(lensChain.id);
    const { uri } = await storageClient.uploadAsJson(groupMetadata, { acl });

    // 5. Create the group on Lens Protocol with optional group rules
    const createGroupParams: any = {
      metadataUri: uri,
      admins: [evmAddress(adminAddress), ADMIN_USER_ADDRESS],
      owner: evmAddress(adminAddress),
    };

    // Add group rules if specified
    if (parsedCommunityRule) {
      createGroupParams.rules = {
        required: [parsedCommunityRule],
      };
    }

    const result = await createGroup(adminSessionClient, createGroupParams)
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
    const persistedCommunity = await persistCommunity(createdGroup.address, name);

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
