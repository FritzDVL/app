import { NextRequest, NextResponse } from "next/server";
import { createFeed } from "@/lib/external/lens/primitives/feeds";

export async function POST(request: NextRequest) {
  try {
    const { title, description, communityAddress } = await request.json();

    if (!title || !communityAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const feedResult = await createFeed({
      title,
      description,
      communityAddress,
    });

    if (!feedResult.success) {
      return NextResponse.json({ success: false, error: feedResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      feed: feedResult.feed,
    });
  } catch (error) {
    console.error("API Feed creation error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
