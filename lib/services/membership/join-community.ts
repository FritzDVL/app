import { Community } from "@/lib/domain/communities/types";
import { incrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { verifyTokenRequirements } from "@/lib/services/verification/verify-token-requirements";
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { PublicClient, WalletClient } from "viem";

export interface JoinLeaveResult {
  success: boolean;
  error?: string;
  verificationError?: {
    required: string;
    symbol: string;
    current: string;
  };
}

/**
 * Join a community using Lens Protocol
 * Based on the existing useJoinCommunity hook logic
 */
export async function joinCommunity(
  community: Community,
  sessionClient: SessionClient,
  walletClient: WalletClient,
  publicClient: PublicClient,
): Promise<JoinLeaveResult> {
  try {
    if (!walletClient.account) {
      return {
        success: false,
        error: "Wallet account not found",
      };
    }

    // 1. Check for Token Gating Rules
    // The Lens SDK returns rules in a specific structure. We need to check 'required' array.
    // Based on our types, it seems we access it via community.group.rules
    // Let's assume the first rule is the one we care about for now, as our UI only supports one.

    // Note: The 'rules' object from Lens might be complex.
    // We need to check if there are any required rules.
    // For this implementation, we'll check if our domain object has rules populated.

    // In our domain type 'Community', group is a Lens Group.
    // We need to inspect how rules are stored on the Group object.
    // Usually it's group.rules.required[]

    const requiredRules = (community.group as any).rules?.required || [];

    if (requiredRules.length > 0) {
      const rule = requiredRules[0]; // Check the first rule

      // Verify requirements
      const verification = await verifyTokenRequirements(rule, walletClient.account.address, publicClient);

      if (!verification.meets) {
        return {
          success: false,
          error: `You need ${verification.required} ${verification.tokenSymbol || "tokens"} to join. You have ${verification.current}.`,
          verificationError: {
            required: verification.required,
            symbol: verification.tokenSymbol || "tokens",
            current: verification.current,
          },
        };
      }
    }

    // 2. Proceed with Join if verification passed (or no rules)
    const result = await joinGroup(sessionClient, {
      group: evmAddress(community.group.address),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

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
