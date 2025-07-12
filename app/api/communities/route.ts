import { NextRequest, NextResponse } from "next/server";
import { lensChain } from "@/lib/chains/lens";
import { getAdminSessionClient } from "@/lib/clients/admin-session";
import { client } from "@/lib/clients/lens-protocol";
import { storageClient } from "@/lib/grove/client";
import { persistCommunity } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { adminWallet } from "@/lib/wallets/admin-wallet";
import { Moderator } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { Group, evmAddress } from "@lens-protocol/client";
import { createGroup, fetchAdminsFor, fetchGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { group } from "@lens-protocol/metadata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const adminAddress = formData.get("adminAddress") as string;
    const file = formData.get("image") as File | null;

    if (!name || !description || !adminAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let iconUri;
    if (file) {
      const acl = immutable(lensChain.id);
      const { uri } = await storageClient.uploadFile(file, { acl });
      iconUri = uri;
    }

    const adminSessionClient = await getAdminSessionClient();

    // 1. Prepare group name for metadata (no spaces, max 20 chars)
    const groupName = name.replace(/\s+/g, "-").slice(0, 20);

    // 1. Build metadata for the group and upload it
    const groupMetadata = group({ name: groupName, description, ...(iconUri ? { icon: iconUri } : {}) });
    const acl = immutable(lensChain.id);
    const { uri } = await storageClient.uploadAsJson(groupMetadata, { acl });

    // 2. Create the group on Lens Protocol
    const result = await createGroup(adminSessionClient, {
      metadataUri: uri,
      admins: [evmAddress(adminAddress)],
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen((txHash: unknown) => {
        console.log("[API] Group txHash:", txHash);
        return fetchGroup(adminSessionClient, { txHash: txHash as string });
      });

    if (result.isErr() || !result.value) {
      let errMsg = "Failed to create group";
      if (result.isErr() && (result as any).error && typeof (result as any).error.message === "string") {
        errMsg = (result as any).error.message;
      }
      console.error("[API] Error creating group:", errMsg, result);
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    const createdGroup = result.value as Group;

    // 4. Persist the community in Supabase (pass full name as well)
    const persistedCommunity = await persistCommunity(createdGroup.address, name);

    // 5. Add new moderators
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

    // 6. Transform and return the new community
    const newCommunity = transformGroupToCommunity(
      createdGroup,
      {
        totalMembers: 0,
        __typename: "GroupStatsResponse",
      },
      persistedCommunity,
      moderators,
    );
    return NextResponse.json({ success: true, community: newCommunity });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
