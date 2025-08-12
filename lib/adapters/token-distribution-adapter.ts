import { TokenDistribution } from "@/lib/domain/rewards/token-distribution";
import { TokenDistribution as LensTokenDistribution } from "@lens-protocol/client";

/**
 * Transform function to convert Lens API response to our TokenDistribution interface
 */
export function adaptLensTokenDistribution(item: LensTokenDistribution): TokenDistribution {
  return {
    id: item.txHash || `${item.timestamp}-${Math.random()}`,
    amount: item.amount?.value || "0",
    token: item.amount?.asset?.symbol || "UNKNOWN",
    timestamp: item.timestamp || new Date().toISOString(),
    type: "Reward Distribution",
  };
}
