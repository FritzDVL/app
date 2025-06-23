import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;
    if (!content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Get admin session

    // 1. Build metadata for the comment

    // 2. Upload metadata to storage (e.g., Grove/IPFS)

    // 3. Create the comment on Lens Protocol

    return NextResponse.json({
      success: true,
      message: "Post created on Lens Protocol.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
