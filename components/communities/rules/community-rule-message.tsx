import React from "react";
import { GroupRuleType } from "@lens-protocol/client";
import { DollarSign, KeyRound, ShieldCheck } from "lucide-react";

interface CommunityRuleMessageProps {
  ruleType: GroupRuleType;
}

export const CommunityRuleMessage: React.FC<CommunityRuleMessageProps> = ({ ruleType }) => {
  switch (ruleType) {
    case GroupRuleType.SimplePayment:
      return (
        <div
          className={`flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200`}
        >
          <DollarSign className="mr-1 h-4 w-4 text-yellow-500" />
          Payment required
        </div>
      );
    case GroupRuleType.TokenGated:
      return (
        <div
          className={`flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200`}
        >
          <KeyRound className="mr-1 h-4 w-4 text-indigo-500" />
          Token required
        </div>
      );
    case GroupRuleType.MembershipApproval:
      return (
        <div
          className={`flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200`}
        >
          <ShieldCheck className="mr-1 h-4 w-4 text-rose-500" />
          Approval required
        </div>
      );
    default:
      return null;
  }
};
