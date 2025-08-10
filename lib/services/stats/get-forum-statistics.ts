/**
 * Get Forum Statistics Service
 * Gets forum-wide statistics using existing external layer
 */
import type { ForumStats } from "@/lib/domain/communities/types";
import { fetchForumStats } from "@/lib/external/supabase/stats";

export interface StatsResult {
  success: boolean;
  stats?: ForumStats;
  error?: string;
}

/**
 * Gets forum-wide statistics using existing external layer
 */
export async function getForumStatistics(): Promise<StatsResult> {
  try {
    const stats = await fetchForumStats();

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error("Failed to fetch forum stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch forum statistics",
    };
  }
}
