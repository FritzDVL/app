import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isMainnet } from "@/lib/env";
import { Address } from "@/types/common";
import { BigDecimal, bigDecimal, evmAddress } from "@lens-protocol/client";
import { AlertTriangle } from "lucide-react";

export interface SimplePaymentGroupRule {
  type: "SimplePaymentGroupRule";
  simplePaymentRule: {
    native: BigDecimal;
    recipient: Address;
  };
}

interface PaymentRuleConfigProps {
  rule: Extract<SimplePaymentGroupRule, { type: "SimplePaymentGroupRule" }>;
  onChange: (rule: SimplePaymentGroupRule) => void;
}

export function PaymentRuleConfig({ rule, onChange }: PaymentRuleConfigProps) {
  const [amount, setAmount] = useState<BigDecimal>(rule.simplePaymentRule.native);
  const [recipient, setRecipient] = useState<Address>(rule.simplePaymentRule.recipient);

  const tokenOptions = isMainnet()
    ? [{ value: "0x000000000000000000000000000000000000800A", label: "GHO", symbol: "GHO" }]
    : [{ value: "0x000000000000000000000000000000000000800A", label: "GRASS", symbol: "GRASS" }];

  return (
    <div className="space-y-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-base font-medium text-foreground">
            Price
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="10.00"
            value={amount}
            onChange={e => {
              setAmount(bigDecimal(e.target.value));
              onChange({
                type: "SimplePaymentGroupRule",
                simplePaymentRule: {
                  native: bigDecimal(e.target.value),
                  recipient: evmAddress(recipient),
                },
              });
            }}
            className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="token" className="text-base font-medium text-foreground">
            Payment Token
          </Label>
          <Input
            id="token"
            value={tokenOptions[0].label}
            disabled
            className="cursor-not-allowed rounded-2xl border-slate-300/60 bg-muted/50 text-base dark:border-gray-600 dark:bg-gray-700"
          />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <Label htmlFor="recipient" className="text-base font-medium text-foreground">
          Payment Recipient
        </Label>
        <Input
          id="recipient"
          placeholder="Wallet address to receive payments"
          value={recipient}
          onChange={e => {
            setRecipient(e.target.value as Address);
            onChange({
              type: "SimplePaymentGroupRule",
              simplePaymentRule: {
                native: bigDecimal(amount),
                recipient: evmAddress(e.target.value as Address),
              },
            });
          }}
          className="h-12 rounded-2xl border-slate-300/60 bg-white/80 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
        />
        <p className="mt-1 flex items-center gap-2 text-base text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          Lens deducts 1.5% treasury fee automatically
        </p>
      </div>
    </div>
  );
}
