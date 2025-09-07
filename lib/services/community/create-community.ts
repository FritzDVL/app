import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community, Moderator } from "@/lib/domain/communities/types";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import { createFeed } from "@/lib/external/lens/primitives/feeds";
import { createLensGroup } from "@/lib/external/lens/primitives/groups";
import { client } from "@/lib/external/lens/protocol-client";
import { persistCommunity } from "@/lib/external/supabase/communities";
import { Address } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor } from "@lens-protocol/client/actions";
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

    let iconUri: string | undefined;
    if (logoFile) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(logoFile, { acl });
      iconUri = uri;
    }

    // 2. Get admin session client
    const creatorSessionClient = sessionClient;
    const creatorWalletClient = walletClient;

    // 4. Create the group on Lens Protocol using extracted function
    const newGroup = await createLensGroup(creatorSessionClient, creatorWalletClient, {
      name,
      description,
      adminAddress,
      iconUri,
      communityRule: parsedCommunityRule,
    });

    if (!newGroup) {
      const errMsg = "Failed to create group";
      console.error("[Service] Error creating group:", errMsg);
      return {
        success: false,
        error: errMsg,
      };
    }

    // 5. Create a new feed for the community
    const newFeed = await createFeed({
      title: name,
      description: description || "",
      communityAddress: newGroup.address,
    });
    if (!newFeed) {
      const errMsg = "Failed to create feed";
      console.error("[Service] Error creating feed:", errMsg);
      return {
        success: false,
        error: errMsg,
      };
    }

    // 6. Persist the community in Supabase
    const persistedCommunity = await persistCommunity(newGroup.address, newFeed.address, name);

    // 7. Fetch moderators
    const adminsResult = await fetchAdminsFor(client, {
      address: evmAddress(newGroup.address),
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
      newGroup,
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
