/**
 * Join Community Service
 * Join a community using Lens Protocol
 */
import { Community } from "@/lib/domain/communities/types";
import { incrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";

export interface JoinLeaveResult {
  success: boolean;
  error?: string;
}

/**
 * Join a community using Lens Protocol
 * Based on the existing useJoinCommunity hook logic
 */
export async function joinCommunity(
  community: Community,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<JoinLeaveResult> {
  try {
    const result = await joinGroup(sessionClient, {
      group: evmAddress(community.address),
    }).andThen(handleOperationWith(walletClient));

    if (result.isOk()) {
      await incrementCommunityMembersCount(community.id);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: result.error.message,
      };
    }
  } catch (error) {
    console.error("Join community failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Join community failed",
    };
  }
}
