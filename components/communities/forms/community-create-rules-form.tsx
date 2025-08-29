"use client";

import React, { useState } from "react";
import {
  MembershipApprovalGroupRule,
  MembershipApprovalRuleForm,
} from "@/components/communities/forms/rules/membership-approval-rule-form";
import { RuleTypeSelect } from "@/components/communities/forms/rules/rule-type-select";
import {
  SimplePaymentGroupRule,
  SimplePaymentRuleForm,
} from "@/components/communities/forms/rules/simple-payment-rule-form";
import { TokenGatedGroupRule, TokenGatedRuleForm } from "@/components/communities/forms/rules/token-gated-rule-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Account, TokenStandard, bigDecimal, evmAddress } from "@lens-protocol/client";
import { AnimatePresence, motion } from "framer-motion";

interface CommunityCreateRulesFormProps {
  onCommunityRuleChange: (
    rule: SimplePaymentGroupRule | TokenGatedGroupRule | MembershipApprovalGroupRule | undefined,
  ) => void;
  recipient: Account;
}

export function CommunityCreateRulesForm({ onCommunityRuleChange, recipient }: CommunityCreateRulesFormProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [communityRule, setCommunityRule] = useState<
    SimplePaymentGroupRule | TokenGatedGroupRule | MembershipApprovalGroupRule | undefined
  >(undefined);

  const handleRuleTypeChange = (type: string) => {
    if (type === "none") {
      setIsEnabled(false);
      return;
    }
    setIsEnabled(true);
    switch (type) {
      case "SimplePaymentGroupRule":
        const simplePaymentRule: SimplePaymentGroupRule = {
          type: "SimplePaymentGroupRule",
          simplePaymentRule: {
            native: bigDecimal("5"),
            recipient: recipient.address,
          },
        };
        setCommunityRule(simplePaymentRule);
        onCommunityRuleChange(simplePaymentRule);
        break;
      case "TokenGatedGroupRule":
        const tokenGatedRule: TokenGatedGroupRule = {
          type: "TokenGatedGroupRule",
          tokenGatedRule: {
            token: {
              currency: evmAddress("0x000000000000000000000000000000000000800A"),
              standard: TokenStandard.Erc721,
              value: bigDecimal("1"),
            },
          },
        };
        setCommunityRule(tokenGatedRule);
        onCommunityRuleChange(tokenGatedRule);
        break;
      case "MembershipApprovalGroupRule":
        const membershipApprovalRule: MembershipApprovalGroupRule = {
          type: "MembershipApprovalGroupRule",
          membershipApprovalRule: { enable: true },
        };
        setCommunityRule(membershipApprovalRule);
        onCommunityRuleChange(membershipApprovalRule);
        break;
    }
  };

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onCommunityRuleChange(undefined);
    } else {
      handleRuleTypeChange("SimplePaymentGroupRule");
    }
  };

  // --- Modular update handlers ---
  const updatePaymentRule = (rule: SimplePaymentGroupRule) => {
    setCommunityRule(rule);
    onCommunityRuleChange(rule);
  };
  const updateTokenGatedRule = (rule: TokenGatedGroupRule) => {
    setCommunityRule(rule);
    onCommunityRuleChange(rule);
  };
  const updateApprovalRule = (rule: MembershipApprovalGroupRule) => {
    setCommunityRule(rule);
    onCommunityRuleChange(rule);
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
              <RuleTypeSelect value={communityRule?.type || "SimplePaymentGroupRule"} onChange={handleRuleTypeChange} />
              {/* Modular config UIs */}
              {communityRule && communityRule.type === "SimplePaymentGroupRule" && (
                <SimplePaymentRuleForm rule={communityRule} onChange={updatePaymentRule} />
              )}
              {communityRule && communityRule.type === "TokenGatedGroupRule" && (
                <TokenGatedRuleForm rule={communityRule} onChange={updateTokenGatedRule} />
              )}
              {communityRule && communityRule.type === "MembershipApprovalGroupRule" && (
                <MembershipApprovalRuleForm onChange={updateApprovalRule} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
