"use server";

import { revalidatePath } from "next/cache";
import { createFeed } from "@/lib/external/lens/primitives/feeds";

export async function createThreadFeedAction(title: string, description: string, communityAddress: string) {
  try {
    if (!title || !communityAddress) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const feedResult = await createFeed({
      title,
      description,
      communityAddress,
    });

    if (!feedResult.success) {
      return {
        success: false,
        error: feedResult.error,
      };
    }

    // Invalidate cache for the community page since we created a new feed
    revalidatePath(`/communities/${communityAddress}`);

    return {
      success: true,
      feed: feedResult.feed,
    };
  } catch (error) {
    console.error("Error creating thread feed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread feed",
    };
  }
}
