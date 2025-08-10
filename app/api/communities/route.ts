import { NextRequest, NextResponse } from "next/server";
import { createCommunity } from "@/lib/services/community-service";
import { Address } from "@/types/common";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const adminAddress = formData.get("adminAddress") as Address;
    const file = formData.get("image") as File | null;

    if (!name || !description || !adminAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use the community service for all business logic
    const result = await createCommunity({ name, description, adminAddress }, file || undefined);

    if (result.success) {
      return NextResponse.json({
        success: true,
        community: result.community,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
