/**
 * Membership Service
 * Orchestrates membership operations using existing hooks and Lens Protocol
 */
import { decrementCommunityMembersCount, incrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { Community } from "@/types/common";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { fetchGroup, joinGroup, leaveGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";

export interface MembershipResult {
  success: boolean;
  isMember?: boolean;
  error?: string;
}

export interface JoinLeaveResult {
  success: boolean;
  error?: string;
}

/**
 * Checks if a user is a member of a community using Lens Protocol
 * Based on the existing useCommunityMembership hook logic
 */
export async function checkCommunityMembership(
  communityAddress: string,
  sessionClient: SessionClient,
): Promise<MembershipResult> {
  try {
    const groupResult = await fetchGroup(sessionClient, {
      group: evmAddress(communityAddress),
    });

    if (groupResult.isOk() && groupResult.value) {
      const isMember = groupResult.value.operations?.isMember || false;
      return {
        success: true,
        isMember,
      };
    }

    return {
      success: true,
      isMember: false,
    };
  } catch (error) {
    console.error("Membership check failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Membership check failed",
    };
  }
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
      group: evmAddress(community.address),
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
