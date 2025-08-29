import { useState } from "react";
import { revalidateCommunityPath } from "@/app/actions/revalidate-path";
import { Community } from "@/lib/domain/communities/types";
import { MembershipApprovalGroupRule, SimplePaymentGroupRule, TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { removeCommunityRule } from "@/lib/services/community/remove-rule-community";
import { updateCommunityRule } from "@/lib/services/community/update-rule-community";
import type { RuleId } from "@lens-protocol/client";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useCommunityRules(community: Community, currentRuleId?: RuleId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const updateRules = async (newRule: SimplePaymentGroupRule | TokenGatedGroupRule | MembershipApprovalGroupRule) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Updating community rule...");
    try {
      if (!sessionClient.data || !walletClient.data) {
        setError(new Error("Wallet or session client not ready"));
        toast.error("Wallet or session client not ready", { id: toastId });
        setLoading(false);
        return;
      }
      const result = await updateCommunityRule(
        community,
        newRule,
        currentRuleId,
        sessionClient.data,
        walletClient.data,
      );
      if (result.success) {
        toast.success("Community rule updated!", { id: toastId });
        revalidateCommunityPath(community.address);
      } else {
        toast.error(result.error || "An error occurred while updating the rule.", { id: toastId });
        setError(new Error(result.error || "Unknown error"));
      }
    } catch (err) {
      setError(err as Error);
      toast.error((err as Error).message || "An error occurred while updating the rule.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const removeRule = async (ruleId: RuleId) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Removing community rule...");
    try {
      if (!sessionClient.data || !walletClient.data) {
        setError(new Error("Wallet or session client not ready"));
        toast.error("Wallet or session client not ready", { id: toastId });
        setLoading(false);
        return;
      }
      const result = await removeCommunityRule(community, ruleId, sessionClient.data, walletClient.data);
      if (result.success) {
        toast.success("Community rule removed!", { id: toastId });
        revalidateCommunityPath(community.address);
      } else {
        toast.error(result.error || "An error occurred while removing the rule.", { id: toastId });
        setError(new Error(result.error || "Unknown error"));
      }
    } catch (err) {
      setError(err as Error);
      toast.error((err as Error).message || "An error occurred while removing the rule.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return { updateRules, removeRule, loading, error };
}
