import React from "react";
import CustomSelectItem from "@/components/ui/custom-select-item";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Lock, Shield } from "lucide-react";

interface RuleTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RuleTypeSelect({ value, onChange }: RuleTypeSelectProps) {
  return (
    <div className="mb-4 space-y-2 overflow-visible">
      <Label className="text-base font-medium text-foreground">Access Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base text-sm backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700">
          <SelectValue placeholder="Choose access type" />
        </SelectTrigger>
        <SelectContent className="z-50 rounded-2xl border-slate-300/60 bg-white/95 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800">
          <CustomSelectItem
            value="SimplePaymentGroupRule"
            className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
          >
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-green-500 data-[state=checked]:text-white" />
              <span>Paid Access</span>
            </div>
          </CustomSelectItem>
          <CustomSelectItem
            value="TokenGatedGroupRule"
            className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-500 data-[state=checked]:text-white" />
              <span>Token Holders Only</span>
            </div>
          </CustomSelectItem>
          <CustomSelectItem
            value="MembershipApprovalGroupRule"
            className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500 data-[state=checked]:text-white" />
              <span>Manual Approval</span>
            </div>
          </CustomSelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
