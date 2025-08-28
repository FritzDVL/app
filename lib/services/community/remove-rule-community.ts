import { Community } from "@/lib/domain/communities/types";
import { removeGroupRule } from "@/lib/external/lens/primitives/groups";
import { RuleId, SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export interface RemoveCommunityRuleResult {
  success: boolean;
  error?: string;
}

export async function removeCommunityRule(
  community: Community,
  ruleIdToRemove: RuleId,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<RemoveCommunityRuleResult> {
  try {
    const ok = await removeGroupRule(community.address, ruleIdToRemove, sessionClient, walletClient);
    if (!ok) {
      return { success: false, error: "Failed to remove group rule on Lens" };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to remove community rule" };
  }
}
