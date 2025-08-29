/**
 * Leave Community Service
 * Leave a community using Lens Protocol
 */
import { Community } from "@/lib/domain/communities/types";
import { decrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { leaveGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";

export interface JoinLeaveResult {
  success: boolean;
  error?: string;
}

/**
 * Leave a community using Lens Protocol
 * Based on the existing useLeaveCommunity hook logic
 */
export async function leaveCommunity(
  community: Community,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<JoinLeaveResult> {
  try {
    const result = await leaveGroup(sessionClient, {
      group: evmAddress(community.group.address),
    }).andThen(handleOperationWith(walletClient));

    if (result.isOk()) {
      await decrementCommunityMembersCount(community.id);
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
    console.error("Leave community failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Leave community failed",
    };
  }
}
