import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommunityRule } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { Shield } from "lucide-react";

interface MembershipApprovalRuleConfigProps {
  rule: Extract<CommunityRule, { type: "MembershipApprovalGroupRule" }>;
  onChange: (approvers: Address[]) => void;
}

export function MembershipApprovalRuleConfig({ rule, onChange }: MembershipApprovalRuleConfigProps) {
  const { account } = useAuthStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="approvers" className="flex items-center gap-2 text-base font-medium text-foreground">
        <Shield className="h-4 w-4 text-purple-600" />
        Additional Approvers
      </Label>
      <Textarea
        id="approvers"
        placeholder="Enter additional wallet addresses (one per line)"
        value={rule.approvers.filter(addr => addr !== account?.address).join("\n")}
        onChange={e => {
          const addresses = e.target.value
            .split("\n")
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0) as Address[];
          onChange(account?.address ? [account.address, ...addresses] : addresses);
        }}
        className="min-h-[80px] w-full rounded-2xl border-slate-300/60 bg-white/80 p-3 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
      />
      <p className="text-base text-muted-foreground">You are automatically included as an approver</p>
    </div>
  );
}
