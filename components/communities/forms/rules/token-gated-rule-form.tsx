import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { Address } from "@/types/common";
import { TokenStandard } from "@lens-protocol/client";

interface TokenGatedRuleFormProps {
  rule: Extract<TokenGatedGroupRule, { type: "TokenGatedGroupRule" }>;
  onChange: (rule: TokenGatedGroupRule) => void;
}

function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function TokenGatedRuleForm({ rule, onChange }: TokenGatedRuleFormProps) {
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>(rule.tokenGatedRule.token.standard);
  const [tokenAddress, setTokenAddress] = useState<string>(rule.tokenGatedRule.token.currency);
  const [tokenValue, setTokenValue] = useState<string>(rule.tokenGatedRule.token.value);
  const [touched, setTouched] = useState(false);

  const validAddress = isValidAddress(tokenAddress);
  const valueNum = Number(tokenValue);
  const validValue = !isNaN(valueNum) && valueNum > 0;

  const handleStandardChange = (v: string) => {
    setTokenStandard(v as TokenStandard);
    setTouched(true);
    onChange({
      type: "TokenGatedGroupRule",
      tokenGatedRule: {
        token: {
          currency: tokenAddress as Address,
          standard: v as TokenStandard,
          value: tokenValue,
        },
      },
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
    setTouched(true);
    onChange({
      type: "TokenGatedGroupRule",
      tokenGatedRule: {
        token: {
          currency: e.target.value as Address,
          standard: tokenStandard,
          value: tokenValue,
        },
      },
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenValue(e.target.value);
    setTouched(true);
    onChange({
      type: "TokenGatedGroupRule",
      tokenGatedRule: {
        token: {
          currency: tokenAddress as Address,
          standard: tokenStandard,
          value: e.target.value,
        },
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <h5 className="mb-3 font-medium text-foreground">Token Gated Configuration</h5>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="mb-1 block text-sm font-medium text-foreground">Token Standard</label>
          <Select value={tokenStandard} onValueChange={handleStandardChange}>
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
            onChange={handleAddressChange}
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
            onChange={handleValueChange}
            onBlur={() => setTouched(true)}
          />
          {!validValue && touched && <div className="mt-1 text-xs text-red-500">Value must be greater than 0</div>}
        </div>
      </div>
    </div>
  );
}
