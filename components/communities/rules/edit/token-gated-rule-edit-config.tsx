import { useState } from "react";
import { TokenGatedGroupRule } from "@/components/communities/rules/types/token-gated-rule-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommunityRules } from "@/hooks/communities/use-community-rules";
import { Community } from "@/lib/domain/communities/types";
import { Address } from "@/types/common";
import { TokenStandard, bigDecimal } from "@lens-protocol/client";
import { GroupRule } from "@lens-protocol/client";

function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

interface TokenGatedRuleEditConfigProps {
  community: Community;
  currentRule?: GroupRule;
}

export function TokenGatedRuleEditConfig({ community, currentRule }: TokenGatedRuleEditConfigProps) {
  const [tokenAddress, setTokenAddress] = useState<Address>("0x0");
  const [tokenValue, setTokenValue] = useState<string>("1");
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>(TokenStandard.Erc721);
  const [touched, setTouched] = useState(false);

  const { updateRules, loading, error } = useCommunityRules(community, currentRule?.id);

  const validAddress = isValidAddress(tokenAddress);
  const valueNum = Number(tokenValue);
  const validValue = !isNaN(valueNum) && valueNum > 0;
  const canSubmit = validAddress && validValue && !loading;

  const handleUpdate = () => {
    setTouched(true);
    if (!canSubmit) return;
    const newRule: TokenGatedGroupRule = {
      type: "TokenGatedGroupRule",
      tokenGatedRule: {
        token: {
          currency: tokenAddress as Address,
          standard: tokenStandard,
          value: bigDecimal(tokenValue),
        },
      },
    };
    updateRules(newRule as any);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h5 className="mb-3 font-medium text-foreground">Token Gated Configuration</h5>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Token Standard</label>
          <Select value={tokenStandard} onValueChange={v => setTokenStandard(v as TokenStandard)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TokenStandard.Erc20}>ERC20 (Token)</SelectItem>
              <SelectItem value={TokenStandard.Erc721}>ERC721 (NFT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Token Contract Address</label>
          <Input
            type="text"
            placeholder="0x..."
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value as Address)}
            onBlur={() => setTouched(true)}
          />
          {!validAddress && touched && <div className="mt-1 text-xs text-red-500">Enter a valid Ethereum address</div>}
        </div>
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">
            {`Minimum Balance (${tokenStandard === TokenStandard.Erc721 ? "NFTs" : "Tokens"})`}
          </label>
          <Input
            type="number"
            step="1"
            min="1"
            placeholder="1"
            value={tokenValue}
            onChange={e => setTokenValue(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {!validValue && touched && <div className="mt-1 text-xs text-red-500">Value must be greater than 0</div>}
        </div>
        <Button onClick={handleUpdate} className="mt-2" disabled={!canSubmit}>
          {loading ? "Updating..." : "Update Rule"}
        </Button>
        {error && <div className="mt-2 text-xs text-red-500">{error.message}</div>}
      </div>
    </div>
  );
}
