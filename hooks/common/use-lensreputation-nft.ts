import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

// Type for LensReputation API response
interface LensReputationApiResponse {
  hasMinted: boolean;
  walletAddress: Address;
}

/**
 * Custom hook to check if the user has minted the LensReputation NFT.
 * Returns { hasNFT, isLoading, error }
 */
export function useLensReputationNFT() {
  const { walletAddress } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lensReputationNFT", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("No wallet address");
      const result = await fetch(`https://lensreputation.xyz/api/public/debug?walletAddress=${walletAddress}`);
      if (result.status === 404) {
        return { hasMinted: false };
      }
      if (!result.ok) {
        throw new Error("Failed to fetch NFT status");
      }
      const data = (await result.json()) as LensReputationApiResponse;
      return data;
    },
    enabled: !!walletAddress,
    staleTime: 10 * 60 * 1000, // 10 minute cache
    retry: 1,
  });

  return {
    hasNFT: data?.hasMinted ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
  };
}
