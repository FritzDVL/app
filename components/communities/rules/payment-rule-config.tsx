import React from "react";
import CustomSelectItem from "@/components/ui/custom-select-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunityRule } from "@/lib/domain/communities/types";
import { AlertTriangle, DollarSign } from "lucide-react";

interface PaymentRuleConfigProps {
  rule: Extract<CommunityRule, { type: "SimplePaymentGroupRule" }>;
  tokenOptions: { value: string; label: string; symbol: string }[];
  onChange: (field: string, value: string) => void;
}

export function PaymentRuleConfig({ rule, tokenOptions, onChange }: PaymentRuleConfigProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center gap-2 text-base font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-green-600" />
            Price
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="10.00"
            value={rule.amount}
            onChange={e => onChange("amount", e.target.value)}
            className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="token" className="text-base font-medium text-foreground">
            Payment Token
          </Label>
          <Select value={rule.token} onValueChange={value => onChange("token", value)}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base text-sm backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-300/60 bg-white/95 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800">
              {tokenOptions.map(token => (
                <CustomSelectItem
                  key={token.value}
                  value={token.value}
                  className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
                >
                  {token.label}
                </CustomSelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="recipient" className="text-base font-medium text-foreground">
          Payment Recipient
        </Label>
        <Input
          id="recipient"
          placeholder="Wallet address to receive payments"
          value={rule.recipient}
          onChange={e => onChange("recipient", e.target.value)}
          className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
        />
        <p className="flex items-center gap-1 text-base text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          Lens deducts 1.5% treasury fee automatically
        </p>
      </div>
    </>
  );
}
