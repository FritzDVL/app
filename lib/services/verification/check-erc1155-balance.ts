import { VerificationResult } from "./verify-token-requirements";
import { TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { Address } from "@/types/common";
import { PublicClient, parseAbi } from "viem";

const ERC1155_ABI = parseAbi([
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)",
]);

export async function checkErc1155Balance(
  rule: TokenGatedGroupRule,
  userAddress: Address,
  publicClient: PublicClient,
): Promise<VerificationResult> {
  const contractAddress = rule.contractAddress as Address;
  const requiredAmount = parseInt(rule.minAmount || "1", 10);
  const tokenId = BigInt(rule.tokenId || "0");

  try {
    // 1. Fetch user balance for specific Token ID
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: ERC1155_ABI,
      functionName: "balanceOf",
      args: [userAddress, tokenId],
    });

    const currentAmount = Number(balance);

    // 2. Compare
    const meets = currentAmount >= requiredAmount;

    return {
      meets,
      required: requiredAmount.toString(),
      current: currentAmount.toString(),
      tokenSymbol: `ID #${tokenId}`, // ERC-1155s don't always have a global symbol
      tokenName: "Collection Item",
    };
  } catch (error) {
    console.error("ERC1155 check failed:", error);
    throw error;
  }
}
