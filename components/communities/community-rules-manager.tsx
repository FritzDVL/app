import { useState } from "react";
import { CommunityRuleMessage } from "@/components/communities/community-rule-message";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Community } from "@/lib/domain/communities/types";
import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { GroupRule, GroupRuleType } from "@lens-protocol/client";

interface CommunityRulesManagerProps {
  community: Community;
}

export function CommunityRulesManager({ community }: CommunityRulesManagerProps) {
  const currentRule = community.rules?.required?.[0] as GroupRule | undefined;
  const currentRuleType = currentRule?.type as GroupRuleType | "none" | undefined;
  const [selectedRule, setSelectedRule] = useState<GroupRuleType | "none">(currentRuleType || "none");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Current Rule</h3>
        {currentRuleType && currentRuleType !== "none" ? (
          <div className="space-y-4">
            <CommunityRuleMessage ruleType={currentRuleType} />

            {/* SimplePayment Rule Details */}
            {currentRuleType === GroupRuleType.SimplePayment && currentRule && (
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h4 className="mb-3 font-medium text-foreground">Payment Configuration</h4>
                <div className="grid gap-3 text-sm">
                  {(() => {
                    const symbolElement = currentRule.config.find(element => element.key === "assetSymbol");
                    const symbol =
                      symbolElement && symbolElement.__typename === "StringKeyValue" ? symbolElement.string : "";
                    const amountElement = currentRule.config.find(element => element.key === "amount");
                    const amount =
                      amountElement && amountElement.__typename === "BigDecimalKeyValue"
                        ? amountElement.bigDecimal
                        : "";
                    const recipient = ADMIN_USER_ADDRESS;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">
                            {amount.toString()} {symbol.toString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Token:</span>
                          <span className="font-medium">{symbol} (Native)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recipient:</span>
                          <span className="font-mono text-xs">{recipient}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200">
            No rule (open community)
          </div>
        )}
      </div>

      {/* Edit Rule Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Change Rule</h4>
        <Select value={selectedRule} onValueChange={v => setSelectedRule(v as GroupRuleType | "none")}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No rule (open community)</SelectItem>
            <SelectItem value={GroupRuleType.SimplePayment}>Payment required</SelectItem>
            <SelectItem value={GroupRuleType.TokenGated}>Token required</SelectItem>
            <SelectItem value={GroupRuleType.MembershipApproval}>Approval required</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Rule Configuration */}
        {selectedRule === GroupRuleType.SimplePayment && (
          <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h5 className="mb-3 font-medium text-foreground">Payment Configuration</h5>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Amount (GHO)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.001"
                  className="w-full rounded-2xl border border-brand-200/40 bg-gray-50/80 px-4 py-2 text-base ring-offset-background placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200/40 focus-visible:ring-offset-2 dark:border-gray-700/60 dark:bg-slate-800/90"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full rounded-2xl border border-brand-200/40 bg-gray-50/80 px-4 py-2 text-base ring-offset-background placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200/40 focus-visible:ring-offset-2 dark:border-gray-700/60 dark:bg-slate-800/90"
                />
              </div>
            </div>
          </div>
        )}

        <Button onClick={() => console.log("Save rule:", selectedRule)} className="mt-4">
          Save Rule
        </Button>
      </div>
    </div>
  );
}
