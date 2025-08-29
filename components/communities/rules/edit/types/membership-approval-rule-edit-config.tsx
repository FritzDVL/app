
import { Button } from "@/components/ui/button";
import { useCommunityRules } from "@/hooks/communities/use-community-rules";
import { Community } from "@/lib/domain/communities/types";
import { MembershipApprovalGroupRule } from "@/lib/domain/rules/types";
import { GroupRule } from "@lens-protocol/client";

interface MembershipApprovalRuleEditConfigProps {
  community: Community;
  currentRule?: GroupRule;
}

export function MembershipApprovalRuleEditConfig({ community, currentRule }: MembershipApprovalRuleEditConfigProps) {
  const { updateRules, loading, error } = useCommunityRules(community, currentRule?.id);

  const handleUpdate = () => {
    const newRule: MembershipApprovalGroupRule = {
      type: "MembershipApprovalGroupRule",
      membershipApprovalRule: { enable: true },
    };
    updateRules(newRule);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h5 className="mb-3 font-medium text-foreground">Membership Approval Configuration</h5>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Only approved members can join this community. You (and optionally other moderators) will need to manually
          approve join requests.
        </div>

        <Button onClick={handleUpdate} className="mt-2" disabled={loading}>
          {loading ? "Updating..." : "Update Rule"}
        </Button>
        {error && <div className="mt-2 text-xs text-red-500">{error.message}</div>}
      </div>
    </div>
  );
}
