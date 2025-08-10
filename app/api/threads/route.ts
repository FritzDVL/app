import { NextRequest, NextResponse } from "next/server";
import { createThread } from "@/lib/services/thread/create-thread";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { communityAddress, title, summary, content, author } = body;

    if (!communityAddress || !title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use the thread service for all business logic
    const result = await createThread(communityAddress, {
      title,
      summary,
      content,
      author,
    });

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
