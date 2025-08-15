import React from "react";
import CustomSelectItem from "@/components/ui/custom-select-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunityRule } from "@/lib/domain/communities/types";
import { Lock } from "lucide-react";

interface TokenGatedRuleConfigProps {
  rule: Extract<CommunityRule, { type: "TokenGatedGroupRule" }>;
  onChange: (field: string, value: string) => void;
}

export function TokenGatedRuleConfig({ rule, onChange }: TokenGatedRuleConfigProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tokenType" className="flex items-center gap-2 text-base font-medium text-foreground">
            <Lock className="h-4 w-4 text-blue-600" />
            Token Type
          </Label>
          <Select value={rule.tokenType} onValueChange={value => onChange("tokenType", value)}>
            <SelectTrigger className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-300/60 bg-white/95 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800">
              <CustomSelectItem
                value="ERC20"
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
              >
                ERC-20
              </CustomSelectItem>
              <CustomSelectItem
                value="ERC721"
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
              >
                NFT
              </CustomSelectItem>
              <CustomSelectItem
                value="ERC1155"
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-brand-50/80 focus:bg-brand-50/80 data-[highlighted]:bg-brand-50/80 data-[state=checked]:bg-brand-500 data-[state=checked]:text-white dark:hover:bg-brand-900/30 dark:focus:bg-brand-900/30 dark:data-[highlighted]:bg-brand-900/30 dark:data-[state=checked]:bg-brand-600"
              >
                ERC-1155
              </CustomSelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="minBalance" className="text-base font-medium text-foreground">
            {rule.tokenType === "ERC20" ? "Min Balance" : "Min Amount"}
          </Label>
          <Input
            id="minBalance"
            type="number"
            placeholder={rule.tokenType === "ERC20" ? "1.0" : "1"}
            value={rule.minBalance}
            onChange={e => onChange("minBalance", e.target.value)}
            className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenAddress" className="text-base font-medium text-foreground">
          Token Contract Address
        </Label>
        <Input
          id="tokenAddress"
          placeholder="0x... token contract address"
          value={rule.tokenAddress}
          onChange={e => onChange("tokenAddress", e.target.value)}
          className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>
      {rule.tokenType === "ERC1155" && (
        <div className="space-y-2">
          <Label htmlFor="tokenId" className="text-base font-medium text-foreground">
            Token ID
          </Label>
          <Input
            id="tokenId"
            placeholder="Token ID"
            value={rule.tokenId || ""}
            onChange={e => onChange("tokenId", e.target.value)}
            className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
      )}
    </>
  );
}
