import { NextRequest, NextResponse } from "next/server";
import { storageClient } from "@/lib/external/grove/client";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { lensChain } from "@/lib/external/lens/chain";
import { persistCommunityThread } from "@/lib/external/supabase/threads";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { immutable } from "@lens-chain/storage-client";
import { evmAddress } from "@lens-protocol/client";
import { createFeed, fetchFeed } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { feed } from "@lens-protocol/metadata";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { communityAddress, title, summary, content, author } = body;
    if (!communityAddress || !title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Get admin session and wallet
    const adminSessionClient = await getAdminSessionClient();
    const adminWallet = await getAdminWallet();
    // 1. Build metadata for the thread
    const metadata = feed({
      name: title,
      description: summary || "",
    });
    const acl = immutable(lensChain.id);
    // 2. Upload metadata to storage (e.g., Grove/IPFS)
    const { uri } = await storageClient.uploadAsJson(metadata, { acl });
    // 3. Create the feed on Lens Protocol
    const feedCreationResult = await createFeed(adminSessionClient, {
      metadataUri: uri,
      admins: [evmAddress(ADMIN_USER_ADDRESS)],
      rules: {
        required: [
          {
            groupGatedRule: {
              group: evmAddress(communityAddress),
            },
          },
        ],
      },
    })
      .andThen(handleOperationWith(adminWallet))
      .andThen(adminSessionClient.waitForTransaction)
      .andThen(txHash => fetchFeed(adminSessionClient, { txHash }));

    if (feedCreationResult.isErr()) {
      return NextResponse.json({ error: feedCreationResult.error.message }, { status: 500 });
    }

    const createdFeed = feedCreationResult.value;
    // 4. Persist the feed in Supabase
    const threadRecord = await persistCommunityThread(communityAddress, createdFeed?.address, author);

    return NextResponse.json({
      success: true,
      message: "Thread created on Lens Protocol and persisted.",
      feed: createdFeed,
      threadRecord,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
