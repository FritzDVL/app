import { Community } from "@/lib/domain/communities/types";
import { MembershipApprovalGroupRule, SimplePaymentGroupRule, TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { updateGroupRule } from "@/lib/external/lens/primitives/groups";
import type { RuleId, SessionClient } from "@lens-protocol/client";
import type { WalletClient } from "viem";

export interface UpdateCommunityRuleResult {
  success: boolean;
  error?: string;
}

export async function updateCommunityRule(
  community: Community,
  rule: SimplePaymentGroupRule | TokenGatedGroupRule | MembershipApprovalGroupRule,
  ruleIdToRemove: RuleId | undefined,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<UpdateCommunityRuleResult> {
  try {
    const ok = await updateGroupRule(community.address, ruleIdToRemove, rule, sessionClient, walletClient);
    if (!ok) {
      return { success: false, error: "Failed to update group rule on Lens" };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update community rule" };
  }
}
