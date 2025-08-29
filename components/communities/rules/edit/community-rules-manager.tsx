import { useState } from "react";
import { CommunityRuleMessage } from "@/components/communities/rules/community-rule-message";
import { MembershipApprovalRuleEditConfig } from "@/components/communities/rules/edit/types/membership-approval-rule-edit-config";
import { SimplePaymentRuleEditConfig } from "@/components/communities/rules/edit/types/simple-payment-rule-edit-config";
import { TokenGatedRuleEditConfig } from "@/components/communities/rules/edit/types/token-gated-rule-edit-config";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommunityRules } from "@/hooks/communities/use-community-rules";
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

  // Add hook for rule actions
  const { removeRule, loading, error } = useCommunityRules(community, currentRule?.id);

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

            {/* TokenGated Rule Details */}
            {currentRuleType === GroupRuleType.TokenGated && currentRule && (
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h4 className="mb-3 font-medium text-foreground">Token Gated Configuration</h4>
                <div className="grid gap-3 text-sm">
                  {(() => {
                    const contractElement = currentRule.config.find(e => e.key === "assetContract");
                    const contract =
                      contractElement && contractElement.__typename === "AddressKeyValue"
                        ? contractElement.address
                        : "";

                    const nameElement = currentRule.config.find(e => e.key === "assetName");
                    const name = nameElement && nameElement.__typename === "StringKeyValue" ? nameElement.string : "";

                    const symbolElement = currentRule.config.find(e => e.key === "assetSymbol");
                    const symbol =
                      symbolElement && symbolElement.__typename === "StringKeyValue" ? symbolElement.string : "";

                    const standardElement = currentRule.config.find(e => e.key === "assetStandard");
                    const standard =
                      standardElement && standardElement.__typename === "IntKeyValue"
                        ? standardElement.int === 20
                          ? "ERC20"
                          : standardElement.int === 721
                            ? "ERC721"
                            : standardElement.int
                        : "";

                    const amountElement = currentRule.config.find(e => e.key === "amount");
                    const amount =
                      amountElement && amountElement.__typename === "BigDecimalKeyValue"
                        ? amountElement.bigDecimal
                        : "";

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Token Contract:</span>
                          <span className="font-mono text-xs">{contract}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Symbol:</span>
                          <span className="font-medium">{symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Standard:</span>
                          <span className="font-medium">{standard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Minimum Balance:</span>
                          <span className="font-medium">{amount.toString()}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* MembershipApproval Rule Details */}
            {currentRuleType === GroupRuleType.MembershipApproval && currentRule && (
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <h4 className="mb-3 font-medium text-foreground">Membership Approval Configuration</h4>
                <div className="text-sm text-muted-foreground">
                  Only approved members can join this community. You (and optionally other moderators) will need to
                  manually approve join requests.
                </div>
                <br />
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

        {selectedRule === "none" && currentRule && (
          <Button onClick={() => removeRule(currentRule.id)} disabled={loading} className="mt-2" variant="destructive">
            {loading ? "Removing..." : "Remove Rule"}
          </Button>
        )}

        {selectedRule === GroupRuleType.SimplePayment && (
          <SimplePaymentRuleEditConfig community={community} currentRule={currentRule} />
        )}
        {/* Token Gated Rule Configuration */}
        {selectedRule === GroupRuleType.TokenGated && (
          <TokenGatedRuleEditConfig community={community} currentRule={currentRule} />
        )}
        {/* Membership Approval Rule Configuration */}
        {selectedRule === GroupRuleType.MembershipApproval && (
          <MembershipApprovalRuleEditConfig community={community} currentRule={currentRule} />
        )}
        {error && <div className="mt-2 text-xs text-red-500">{error.message}</div>}
      </div>
    </div>
  );
}
