import { useEffect, useState } from "react";
import { lensReputationAbi } from "../../lib/lensreputation/abi";
import { publicClient } from "@/lib/external/lens/chain-client";
import { Env, getCurrentEnv } from "@/lib/env";
import { Address } from "@/types/common";
import { readContract } from "viem/actions";

const LENS_REPUTATION_ADDRESS = "0x0FfDAE7f5087a98db8D670f8BeB9797AA321a32B" as Address;

/**
 * Custom hook to fetch the LensReputation score for the connected user on LensMainnet.
 * Handles the response and returns score, loading, and error states.
 */
export interface UseLensReputationScoreResult {
  reputation: number | undefined;
  isLoading: boolean;
  error: unknown;
  canCreateCommunity: boolean;
  canCreateThread: boolean;
}

export function useLensReputationScore(walletAddress?: Address, lensAccount?: Address): UseLensReputationScoreResult {
  const [reputation, setReputation] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const env = getCurrentEnv();
  const isTestnet = env === Env.TESTNET;

  useEffect(() => {
    // Reset state if addresses are missing
    if (!walletAddress || !lensAccount) {
      setReputation(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    if (isTestnet) {
      setReputation(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    let cancelled = false;

    async function fetchScore() {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await readContract(publicClient, {
          address: LENS_REPUTATION_ADDRESS,
          abi: lensReputationAbi,
          functionName: "getScoreByAddress",
          args: [walletAddress, lensAccount],
        });
        if (!cancelled) {
          // Narrow result type to expected shape
          const { score } = result as { score: number | string };
          const scoreNumber = Number(score);
          setReputation(scoreNumber);
        }
      } catch (err) {
        console.error("Error fetching LensReputation score:", err);
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchScore();

    return () => {
      cancelled = true;
    };
  }, [walletAddress, lensAccount, isTestnet]);

  // Calculate permissions based on score
  const canCreateCommunity = isTestnet || (typeof reputation === "number" && reputation >= 700);
  const canCreateThread = isTestnet || (typeof reputation === "number" && reputation >= 400);

  return {
    reputation,
    isLoading,
    error,
    canCreateCommunity,
    canCreateThread,
  };
}
