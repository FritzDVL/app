import { lensReputationAbi } from "../../lib/lensreputation/abi";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { useReadContract } from "wagmi";

const LENS_REPUTATION_ADDRESS = "0x0FfDAE7f5087a98db8D670f8BeB9797AA321a32B" as Address;

/**
 * Custom hook to fetch the LensReputation score for the connected user on LensMainnet.
 * Handles the response and returns score, timestamp, loading, and error states.
 */
export interface LensReputationScore {
  score: number | undefined;
  timestamp: number | undefined;
  timestampDate: Date | undefined;
}

export function useLensReputationScore() {
  const { account, walletAddress } = useAuthStore();

  const result = useReadContract({
    address: LENS_REPUTATION_ADDRESS,
    abi: lensReputationAbi,
    functionName: "getScoreByAddress",
    args: [walletAddress, account?.address],
    query: {
      enabled: Boolean(walletAddress && account?.address),
      staleTime: 1000 * 60 * 5,
    },
  });

  let score: number | undefined = undefined;
  let timestamp: number | undefined = undefined;
  let timestampDate: Date | undefined = undefined;

  if (result.data && Array.isArray(result.data)) {
    score = Number(result.data[0]);
    timestamp = Number(result.data[1]);
    if (!isNaN(timestamp)) {
      timestampDate = new Date(timestamp * 1000);
    }
  }

  return {
    reputation: {
      score,
      timestamp,
      timestampDate,
    },
    isLoading: result.isLoading,
    error: result.error,
  };
}
