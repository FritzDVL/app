import React, { useEffect } from "react";

export interface MembershipApprovalGroupRule {
  type: "MembershipApprovalGroupRule";
  membershipApprovalRule: { enable: true };
}

interface MembershipApprovalRuleFormProps {
  onChange: (rule: MembershipApprovalGroupRule) => void;
}

export function MembershipApprovalRuleForm({ onChange }: MembershipApprovalRuleFormProps) {
  useEffect(() => {
    onChange({
      type: "MembershipApprovalGroupRule",
      membershipApprovalRule: { enable: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-2">
        <p className="text-base text-muted-foreground">
          Only approved members can join this community. You (and optionally other moderators) will need to manually
          approve join requests.
        </p>
      </div>
    </div>
  );
}
