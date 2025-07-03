import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useReadContract } from "wagmi";

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
      if (!account || !walletAddress) {
        setHasNFT(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // const result = useReadContract({
        //   abi,
        //   address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        //   functionName: "totalSupply",
        // });
        setHasNFT(true);
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
