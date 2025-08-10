import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionClient } from "@/lib/external/lens/admin-session";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { createThread } from "@/lib/services/thread/create-thread";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { communityAddress, title, summary, content, author, tags } = body;

    if (!communityAddress || !title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get admin session and wallet
    const sessionClient = await getAdminSessionClient();
    const walletClient = await getAdminWallet();

    // Use the thread service for all business logic
    const result = await createThread(
      communityAddress,
      {
        title,
        summary,
        content,
        author,
        tags,
      },
      sessionClient,
      walletClient,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Thread created on Lens Protocol and persisted.",
      thread: result.thread,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
