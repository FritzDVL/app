import { useState } from "react";
import { SimplePaymentGroupRule } from "../../../forms/rules/simple-payment-rule-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommunityRules } from "@/hooks/communities/use-community-rules";
import { Community } from "@/lib/domain/communities/types";
import { Address } from "@/types/common";
import { GroupRule, bigDecimal } from "@lens-protocol/client";

function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

interface SimplePaymentRuleConfigProps {
  community: Community;
  currentRule?: GroupRule;
}

export function SimplePaymentRuleConfig({ community, currentRule }: SimplePaymentRuleConfigProps) {
  const [localAmount, setLocalAmount] = useState("0.001");
  const [localRecipient, setLocalRecipient] = useState<Address | string>("0x0");
  const [touched, setTouched] = useState(false);

  // Allow currentRule to be undefined
  const { updateRules, loading, error } = useCommunityRules(community, currentRule?.id);

  const amountNum = Number(localAmount);
  const validAmount = !isNaN(amountNum) && amountNum > 0;
  const validRecipient = isValidAddress(localRecipient);
  const canSubmit = validAmount && validRecipient && !loading;

  const handleUpdate = () => {
    setTouched(true);
    if (!canSubmit) return;
    const newRule: SimplePaymentGroupRule = {
      type: "SimplePaymentGroupRule",
      simplePaymentRule: {
        native: bigDecimal(localAmount),
        recipient: localRecipient as Address,
      },
    };
    updateRules(newRule);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h5 className="mb-3 font-medium text-foreground">Payment Configuration</h5>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Amount (GHO)</label>
          <Input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.001"
            value={localAmount}
            onChange={e => {
              let raw = e.target.value;
              if (raw.includes(",")) raw = raw.replace(/,/g, ".");
              if (raw.includes("-")) return;

              if (raw === "") {
                setLocalAmount("");
                return;
              }
              const normalized = raw.startsWith(".") ? `0${raw}` : raw;

              if (!/^\d+(\.\d*)?$/.test(normalized)) return;
              const parts = normalized.split(".");
              const singleDot = parts.length > 1 ? parts[0] + "." + parts.slice(1).join("") : normalized;
              const final = singleDot.replace(/^0+(?=\d)/, "");

              setLocalAmount(final);
            }}
            onBlur={() => setTouched(true)}
          />
          {!validAmount && touched && <div className="mt-1 text-xs text-red-500">Amount must be greater than 0</div>}
        </div>
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Recipient Address</label>
          <Input
            type="text"
            placeholder="0x..."
            value={localRecipient}
            onChange={e => setLocalRecipient(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {!validRecipient && touched && (
            <div className="mt-1 text-xs text-red-500">Enter a valid Ethereum address</div>
          )}
        </div>
        <Button onClick={handleUpdate} className="mt-2" disabled={!canSubmit}>
          {loading ? "Updating..." : "Update Rule"}
        </Button>
        {error && <div className="mt-2 text-xs text-red-500">{error.message}</div>}
      </div>
    </div>
  );
}
