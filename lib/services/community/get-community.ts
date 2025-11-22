import { adaptGroupToCommunity } from "@/lib/adapters/community-adapter";
import { Community } from "@/lib/domain/communities/types";
import {
  fetchAdminsFromGroup,
  fetchGroupFromLens,
  fetchGroupStatsFromLens,
} from "@/lib/external/lens/primitives/groups";
import { fetchCommunity as fetchCommunityDb, persistCommunity } from "@/lib/external/supabase/communities";
import { Address } from "@/types/common";
import { SessionClient } from "@lens-protocol/client";

export interface CommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Gets a single community by address using service approach
 */
export async function getCommunity(address: Address, sessionClient?: SessionClient): Promise<CommunityResult> {
  try {
    // Fetch Lens data in parallel first to ensure it exists on chain
    const [group, groupStats, moderators] = await Promise.all([
      fetchGroupFromLens(address, sessionClient),
      fetchGroupStatsFromLens(address),
      fetchAdminsFromGroup(address),
    ]);

    if (!group || !groupStats) {
      return {
        success: false,
        error: "Failed to fetch community data from Lens Protocol",
      };
    }

    // Fetch database community
    let dbCommunity = await fetchCommunityDb(address);

    // If not in DB but found on Lens, persist it (Lazy Sync)
    if (!dbCommunity) {
      console.log(`Community ${address} missing in DB, syncing from Lens...`);
      if (!group.feed?.address) {
        return {
          success: false,
          error: "Group feed address is missing from Lens data",
        };
      }

      try {
        dbCommunity = await persistCommunity(
          group.address,
          group.feed.address,
          group.metadata?.name || "Unknown Community",
        );
      } catch (persistError) {
        console.error("Failed to persist community during lazy sync:", persistError);
        return {
          success: false,
          error: "Failed to sync community to database",
        };
      }
    }

    const community = adaptGroupToCommunity(group, groupStats, dbCommunity, moderators);

    return {
      success: true,
      community,
    };
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community",
    };
  }
}
