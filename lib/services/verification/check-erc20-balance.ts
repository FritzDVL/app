import { VerificationResult } from "./verify-token-requirements";
import { TokenGatedGroupRule } from "@/lib/domain/rules/types";
import { Address } from "@/types/common";
import { PublicClient, formatUnits, parseAbi } from "viem";

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]);

export async function checkErc20Balance(
  rule: TokenGatedGroupRule,
  userAddress: Address,
  publicClient: PublicClient,
): Promise<VerificationResult> {
  const contractAddress = rule.contractAddress as Address;
  const requiredAmount = parseFloat(rule.minAmount || "0");

  try {
    // 1. Fetch token metadata (decimals, symbol)
    const [decimals, symbol, name] = await Promise.all([
      publicClient
        .readContract({
          address: contractAddress,
          abi: ERC20_ABI,
          functionName: "decimals",
        })
        .catch(() => 18), // Default to 18 if fails
      publicClient
        .readContract({
          address: contractAddress,
          abi: ERC20_ABI,
          functionName: "symbol",
        })
        .catch(() => "TOKENS"),
      publicClient
        .readContract({
          address: contractAddress,
          abi: ERC20_ABI,
          functionName: "name",
        })
        .catch(() => "Unknown Token"),
    ]);

    // 2. Fetch user balance
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [userAddress],
    });

    // 3. Format balance
    const formattedBalance = formatUnits(balance, Number(decimals));
    const currentAmount = parseFloat(formattedBalance);

    // 4. Compare
    const meets = currentAmount >= requiredAmount;

    return {
      meets,
      required: requiredAmount.toString(),
      current: currentAmount.toFixed(4), // Show up to 4 decimals
      tokenSymbol: String(symbol),
      tokenName: String(name),
    };
  } catch (error) {
    console.error("ERC20 check failed:", error);
    throw error;
  }
}
