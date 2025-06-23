import { NextRequest, NextResponse } from "next/server";
import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { getAdminSessionClient } from "@/lib/clients/admin-session";
import { APP_ADDRESS } from "@/lib/constants";
import { storageClient } from "@/lib/grove";
import { persistCommunity } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { adminWallet } from "@/lib/wallets/admin-wallet";
import { immutable } from "@lens-chain/storage-client";
import { Group, evmAddress } from "@lens-protocol/client";
import { createGroup, fetchGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { group } from "@lens-protocol/metadata";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, description, adminAddress } = body;
    if (!name || !description || !adminAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminSessionClient = await getAdminSessionClient();

    // 1. Build metadata for the group and upload it
    const groupMetadata = group({ name, description });
    const acl = immutable(lensMainnet.id);
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
    console.log("[API] Created group:", createdGroup);

    // 3. Add the group to the app
    // const addAppGroupResult = await addAppGroups(adminSessionClient, {
    //   groups: [evmAddress(createdGroup.address)],
    //   app: evmAddress(APP_ADDRESS),
    // })
    //   .andThen(handleOperationWith(adminWallet))
    //   .andThen(adminSessionClient.waitForTransaction);

    // if (addAppGroupResult.isErr()) {
    //   const err = (addAppGroupResult as any).error;
    //   console.error("[API] Error adding group to app:", err);
    //   return NextResponse.json({ error: (err && err.message) || "Failed to add group to app" }, { status: 500 });
    // }
    // console.log("[API] Group added to app");

    // 4. Persist the community in Supabase
    await persistCommunity(createdGroup.address);
    console.log("[API] Community persisted in Supabase:", createdGroup.address);
    const newCommunity = transformGroupToCommunity(createdGroup);
    console.log("[API] Returning new community:", newCommunity);
    return NextResponse.json({ success: true, community: newCommunity });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
