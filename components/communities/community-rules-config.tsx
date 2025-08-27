"use client";

import React, { useState } from "react";
import { MembershipApprovalRuleConfig } from "@/components/communities/rules/membership-approval-rule-config";
import { PaymentRuleConfig } from "@/components/communities/rules/payment-rule-config";
import { RuleTypeSelect } from "@/components/communities/rules/rule-type-select";
import { TokenGatedRuleConfig } from "@/components/communities/rules/token-gated-rule-config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CommunityRule } from "@/lib/domain/communities/types";
import { isMainnet } from "@/lib/env";
import { Address } from "@/types/common";
import { Account } from "@lens-protocol/client";
import { AnimatePresence, motion } from "framer-motion";

interface CommunityRulesConfigProps {
  communityRule: CommunityRule;
  onCommunityRuleChange: (rule: CommunityRule) => void;
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
const defaultToken = tokenOptions[0].value;

export function CommunityRulesConfig({ communityRule, onCommunityRuleChange, recipient }: CommunityRulesConfigProps) {
  const [isEnabled, setIsEnabled] = useState(communityRule.type !== "none");

  const handleRuleTypeChange = (type: string) => {
    if (type === "none") {
      onCommunityRuleChange({ type: "none" });
      setIsEnabled(false);
      return;
    }
    setIsEnabled(true);
    switch (type) {
      case "SimplePaymentGroupRule":
        onCommunityRuleChange({
          type: "SimplePaymentGroupRule",
          amount: "",
          token: defaultToken as Address,
          recipient: recipient.address,
        });
        break;
      case "TokenGatedGroupRule":
        onCommunityRuleChange({
          type: "TokenGatedGroupRule",
          tokenAddress: "0x0000000000000000000000000000000000000000",
          minBalance: "",
          tokenType: "ERC20",
        });
        break;
      case "MembershipApprovalGroupRule":
        onCommunityRuleChange({
          type: "MembershipApprovalGroupRule",
          approvers: [recipient.address],
        });
        break;
    }
  };

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onCommunityRuleChange({ type: "none" });
    } else {
      handleRuleTypeChange("SimplePaymentGroupRule");
    }
  };

  // --- Modular update handlers ---
  const updatePaymentRule = (field: string, value: string) => {
    if (communityRule.type === "SimplePaymentGroupRule") {
      onCommunityRuleChange({ ...communityRule, [field]: value });
    }
  };
  const updateTokenGatedRule = (field: string, value: string) => {
    if (communityRule.type === "TokenGatedGroupRule") {
      onCommunityRuleChange({ ...communityRule, [field]: value });
    }
  };
  const updateApprovalRule = (approvers: Address[]) => {
    if (communityRule.type === "MembershipApprovalGroupRule") {
      onCommunityRuleChange({ ...communityRule, approvers });
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
      {/* Access Type Selection (animated) */}
      <AnimatePresence initial={false}>
        {isEnabled && (
          <motion.div
            key="rules-block"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-2">
              <RuleTypeSelect value={communityRule.type} onChange={handleRuleTypeChange} />
              {/* Modular config UIs */}
              {communityRule.type === "SimplePaymentGroupRule" && (
                <PaymentRuleConfig rule={communityRule} tokenOptions={tokenOptions} onChange={updatePaymentRule} />
              )}
              {communityRule.type === "TokenGatedGroupRule" && (
                <TokenGatedRuleConfig rule={communityRule} onChange={updateTokenGatedRule} />
              )}
              {communityRule.type === "MembershipApprovalGroupRule" && (
                <MembershipApprovalRuleConfig rule={communityRule} onChange={updateApprovalRule} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
