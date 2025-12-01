import { checkErc20Balance } from "./check-erc20-balance";
import { checkErc721Balance } from "./check-erc721-balance";
import { checkErc1155Balance } from "./check-erc1155-balance";
import { GroupRule, TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { Address } from "@/types/common";
import { PublicClient } from "viem";

export interface VerificationResult {
  meets: boolean;
  required: string;
  current: string;
  tokenSymbol?: string;
  tokenName?: string;
  error?: string;
}

/**
 * Verifies if a user meets the token requirements for a group rule.
 * Supports ERC-20, ERC-721, and ERC-1155 standards.
 */
export async function verifyTokenRequirements(
  rule: GroupRule,
  userAddress: Address,
  publicClient: PublicClient,
): Promise<VerificationResult> {
  // 1. Check if it's a token gated rule
  if (rule.type !== "TokenGatedGroupRule") {
    return { meets: true, required: "0", current: "0" };
  }

  const tokenRule = rule as TokenGatedGroupRule;
  const contractAddress = tokenRule.contractAddress as Address;

  // 2. Determine token standard and delegate to specific checker
  try {
    switch (tokenRule.tokenType) {
      case "ERC20":
        return await checkErc20Balance(tokenRule, userAddress, publicClient);

      case "ERC721":
        return await checkErc721Balance(tokenRule, userAddress, publicClient);

      case "ERC1155":
        return await checkErc1155Balance(tokenRule, userAddress, publicClient);

      default:
        return {
          meets: false,
          required: "0",
          current: "0",
          error: `Unsupported token type: ${tokenRule.tokenType}`,
        };
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return {
      meets: false,
      required: tokenRule.minAmount || "1",
      current: "0",
      error: "Failed to verify token balance. Please try again.",
    };
  }
}
