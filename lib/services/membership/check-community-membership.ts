/**
 * Check Community Membership Service
 * Checks if a user is a member of a community using Lens Protocol
 */
import { SessionClient, evmAddress } from "@lens-protocol/client";
import { fetchGroup } from "@lens-protocol/client/actions";

export interface MembershipResult {
  success: boolean;
  isMember?: boolean;
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
