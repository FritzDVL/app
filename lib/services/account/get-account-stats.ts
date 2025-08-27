import { client } from "@/lib/external/lens/protocol-client";
import { evmAddress } from "@lens-protocol/client";
import { fetchAccountStats } from "@lens-protocol/client/actions";

export interface AccountStats {
  followers: number;
  following: number;
  posts: number;
}

export interface AccountStatsResult {
  success: boolean;
  stats?: AccountStats;
  error?: string;
}

/**
 * Fetches account statistics (followers, following, posts) using Lens Protocol
 */
export async function getAccountStats(address: string): Promise<AccountStatsResult> {
  try {
    const statsResult = await fetchAccountStats(client, {
      account: evmAddress(address),
    });

    if (statsResult.isOk() && statsResult.value) {
      const s = statsResult.value;
      return {
        success: true,
        stats: {
          followers: s.graphFollowStats?.followers || 0,
          following: s.graphFollowStats?.following || 0,
          posts: s.feedStats?.posts || 0,
        },
      };
    }

    return {
      success: false,
      error: "Failed to fetch account statistics",
    };
  } catch (error) {
    console.error("Failed to fetch account stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch account statistics",
    };
  }
}
