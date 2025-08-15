"use client";

import React, { useState } from "react";
import CustomSelectItem from "@/components/ui/custom-select-item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CommunityRule } from "@/lib/domain/communities/types";
import { isMainnet } from "@/lib/env";
import { Address } from "@/types/common";
import { Account } from "@lens-protocol/client";
import { AlertTriangle, Coins, DollarSign, Lock, Shield } from "lucide-react";

interface CommunityRulesConfigProps {
  groupRule: CommunityRule;
  onGroupRuleChange: (rule: CommunityRule) => void;
  recipient: Account;
}

// Token configurations for different networks
const tokenOptions = isMainnet()
  ? [
      { value: "0x000000000000000000000000000000000000800A", label: "GHO", symbol: "GHO" },
      { value: "0xE5ecd226b3032910CEaa43ba92EE8232f8237553", label: "WETH", symbol: "WETH" },
      { value: "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F", label: "WGHO", symbol: "WGHO" },
      { value: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884", label: "USDC", symbol: "USDC" },
      { value: "0xB0588f9A9cADe7CD5f194a5fe77AcD6A58250f82", label: "BONSAI", symbol: "BONSAI" },
    ]
  : [
      { value: "0x000000000000000000000000000000000000800A", label: "GRASS", symbol: "GRASS" },
      { value: "0xaA91D645D7a6C1aeaa5988e0547267B77d33fe16", label: "WETH", symbol: "WETH" },
      { value: "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8", label: "WGRASS", symbol: "WGRASS" },
    ];

export function CommunityRulesConfig({ groupRule, onGroupRuleChange, recipient }: CommunityRulesConfigProps) {
  const [isEnabled, setIsEnabled] = useState(groupRule.type !== "none");

  // Default token (first option for each network)
  const defaultToken = tokenOptions[0].value;

  const handleRuleTypeChange = (type: string) => {
    if (type === "none") {
      onGroupRuleChange({ type: "none" });
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    switch (type) {
      case "SimplePaymentGroupRule":
        onGroupRuleChange({
          type: "SimplePaymentGroupRule",
          amount: "",
          token: defaultToken as Address,
          recipient: recipient.address,
        });
        break;
      case "TokenGatedGroupRule":
        onGroupRuleChange({
          type: "TokenGatedGroupRule",
          tokenAddress: "0x0000000000000000000000000000000000000000",
          minBalance: "",
          tokenType: "ERC20",
        });
        break;
      case "MembershipApprovalGroupRule":
        onGroupRuleChange({
          type: "MembershipApprovalGroupRule",
          approvers: [recipient.address],
        });
        break;
    }
  };

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onGroupRuleChange({ type: "none" });
    } else {
      handleRuleTypeChange("SimplePaymentGroupRule");
    }
  };

  const updatePaymentRule = (field: string, value: string) => {
    if (groupRule.type === "SimplePaymentGroupRule") {
      onGroupRuleChange({
        ...groupRule,
        [field]: value,
      });
    }
  };

  const updateTokenGatedRule = (field: string, value: string) => {
    if (groupRule.type === "TokenGatedGroupRule") {
      onGroupRuleChange({
        ...groupRule,
        [field]: value,
      });
    }
  };

  const updateApprovalRule = (approvers: Address[]) => {
    if (groupRule.type === "MembershipApprovalGroupRule") {
      onGroupRuleChange({
        ...groupRule,
        approvers,
      });
    }
  };

  return (
    <>
      {/* Community Access Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium text-foreground">Community Access</Label>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} />
        </div>
        <p className="text-base text-muted-foreground">
          {isEnabled ? "Configure how users can join your community" : "Community will be free to join for everyone"}
        </p>
      </div>

      {/* Access Type Selection */}
      {isEnabled && (
        <>
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">Access Type</Label>
            <Select value={groupRule.type} onValueChange={handleRuleTypeChange}>
              <SelectTrigger className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base text-sm backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700">
                <SelectValue placeholder="Choose access type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-300/60 bg-white/95 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800">
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

          {/* Payment Configuration */}
          {groupRule.type === "SimplePaymentGroupRule" && (
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
                    value={groupRule.amount}
                    onChange={e => updatePaymentRule("amount", e.target.value)}
                    className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token" className="text-base font-medium text-foreground">
                    Payment Token
                  </Label>
                  <Select value={groupRule.token} onValueChange={value => updatePaymentRule("token", value)}>
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
                  value={groupRule.recipient}
                  onChange={e => updatePaymentRule("recipient", e.target.value)}
                  className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                />
                <p className="flex items-center gap-1 text-base text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Lens deducts 1.5% treasury fee automatically
                </p>
              </div>
            </>
          )}

          {/* Token Gating Configuration */}
          {groupRule.type === "TokenGatedGroupRule" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenType" className="flex items-center gap-2 text-base font-medium text-foreground">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Token Type
                  </Label>
                  <Select value={groupRule.tokenType} onValueChange={value => updateTokenGatedRule("tokenType", value)}>
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
                    {groupRule.tokenType === "ERC20" ? "Min Balance" : "Min Amount"}
                  </Label>
                  <Input
                    id="minBalance"
                    type="number"
                    placeholder={groupRule.tokenType === "ERC20" ? "1.0" : "1"}
                    value={groupRule.minBalance}
                    onChange={e => updateTokenGatedRule("minBalance", e.target.value)}
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
                  value={groupRule.tokenAddress}
                  onChange={e => updateTokenGatedRule("tokenAddress", e.target.value)}
                  className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              {groupRule.tokenType === "ERC1155" && (
                <div className="space-y-2">
                  <Label htmlFor="tokenId" className="text-base font-medium text-foreground">
                    Token ID
                  </Label>
                  <Input
                    id="tokenId"
                    placeholder="Token ID"
                    value={groupRule.tokenId || ""}
                    onChange={e => updateTokenGatedRule("tokenId", e.target.value)}
                    className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              )}
            </>
          )}

          {/* Approval Configuration */}
          {groupRule.type === "MembershipApprovalGroupRule" && (
            <div className="space-y-2">
              <Label htmlFor="approvers" className="flex items-center gap-2 text-base font-medium text-foreground">
                <Shield className="h-4 w-4 text-purple-600" />
                Additional Approvers
              </Label>
              <Textarea
                id="approvers"
                placeholder="Enter additional lens account addresse (one per line)"
                value={groupRule.approvers.filter(addr => addr !== recipient.address).join("\n")}
                onChange={e => {
                  const addresses = e.target.value
                    .split("\n")
                    .map(addr => addr.trim())
                    .filter(addr => addr.length > 0) as Address[];
                  updateApprovalRule(recipient.address ? [recipient.address, ...addresses] : addresses);
                }}
                className="min-h-[80px] w-full rounded-2xl border-slate-300/60 bg-white/80 p-3 text-lg backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
              />
              <p className="text-base text-muted-foreground">You are automatically included as an approver</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
