import { VerificationResult } from "./verify-token-requirements";
import { TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { Address } from "@/types/common";
import { PublicClient, parseAbi } from "viem";

const ERC721_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]);

export async function checkErc721Balance(
  rule: TokenGatedGroupRule,
  userAddress: Address,
  publicClient: PublicClient,
): Promise<VerificationResult> {
  const contractAddress = rule.contractAddress as Address;
  const requiredAmount = parseInt(rule.minAmount || "1", 10);

  try {
    // 1. Fetch token metadata
    const [symbol, name] = await Promise.all([
      publicClient
        .readContract({
          address: contractAddress,
          abi: ERC721_ABI,
          functionName: "symbol",
        })
        .catch(() => "NFT"),
      publicClient
        .readContract({
          address: contractAddress,
          abi: ERC721_ABI,
          functionName: "name",
        })
        .catch(() => "Unknown NFT"),
    ]);

    // 2. Fetch user balance (number of NFTs owned)
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: "balanceOf",
      args: [userAddress],
    });

    const currentAmount = Number(balance);

    // 3. Compare
    const meets = currentAmount >= requiredAmount;

    return {
      meets,
      required: requiredAmount.toString(),
      current: currentAmount.toString(),
      tokenSymbol: String(symbol),
      tokenName: String(name),
    };
  } catch (error) {
    console.error("ERC721 check failed:", error);
    throw error;
  }
}
