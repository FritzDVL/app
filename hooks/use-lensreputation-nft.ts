import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

// Type for LensReputation API response
interface LensReputationApiResponse {
  minted: boolean;
  nft: {
    tokenId: string;
    image: string;
  } | null;
  score: {
    total: number;
    categories: {
      protocol: number;
      network: number;
      financial: number;
      testnet: number;
    };
  } | null;
  timestamp: number;
}

/**
 * Custom hook to check if the user has minted the LensReputation NFT.
 * Returns { hasNFT, isLoading, error }
 */
export function useLensReputationNFT() {
  const [hasNFT, setHasNFT] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { account, walletAddress } = useAuthStore();

  useEffect(() => {
    const doCheckAccountHasMintedNFT = async () => {
      if (!account?.address || !walletAddress) {
        setHasNFT(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetch(
          `https://lensreputation.xyz/api/public/sbt?wallet=${walletAddress}&lensAccountAddress=${account.address}`,
        );
        if (result.status === 404) {
          setHasNFT(false);
          setIsLoading(false);
          return;
        }
        if (!result.ok) {
          console.error("Failed to fetch NFT status:", result.statusText);
          throw new Error("Failed to fetch NFT status");
        }
        const data = (await result.json()) as LensReputationApiResponse;

        setHasNFT(data.minted);
      } catch (err) {
        console.error("Error checking NFT ownership:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while checking NFT ownership");
        }
        setHasNFT(false);
      } finally {
        setIsLoading(false);
      }
    };
    doCheckAccountHasMintedNFT();
  }, [account, walletAddress]);

  return { hasNFT, isLoading, error };
}
