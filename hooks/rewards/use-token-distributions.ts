import { useCallback, useEffect, useState } from "react";
import { TokenDistribution } from "@/lib/domain/rewards/token-distribution";
import { fetchAllTokenDistributions } from "@/lib/external/lens/primitives/token-distribution";
import { useAuthStore } from "@/stores/auth-store";
import { useSessionClient } from "@lens-protocol/react";

export interface TokenDistributionResult {
  distributions: TokenDistribution[];
  loading: boolean;
  error: string | null;
  totalRewards: number;
  monthlyRewards: number;
  isRewardsAvailable: boolean;
}

export function useTokenDistributions(): TokenDistributionResult {
  const [allDistributions, setAllDistributions] = useState<TokenDistribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account } = useAuthStore();
  const sessionClient = useSessionClient();

  // Fetch all pages automatically to calculate accurate totals
  const fetchAllDistributions = useCallback(async () => {
    if (!account?.address) {
      setAllDistributions([]);
      setError(null);
      return;
    }
    if (!sessionClient.data) {
      setError("Session client is not available");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await fetchAllTokenDistributions(sessionClient.data);

    setAllDistributions(result.distributions);
    setError(result.error);
    setLoading(false);
  }, [account?.address, sessionClient.data]);

  useEffect(() => {
    fetchAllDistributions();
  }, [fetchAllDistributions]);

  // Calculate totals from all distributions
  const totalRewards = allDistributions.reduce((sum, dist) => sum + parseFloat(dist.amount), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRewards = allDistributions
    .filter(dist => {
      const date = new Date(dist.timestamp);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, dist) => sum + parseFloat(dist.amount), 0);

  // Return only the last 50 distributions for display, but calculate totals from all
  const distributionsToShow = allDistributions.slice(-50).reverse(); // Show most recent first

  return {
    distributions: distributionsToShow,
    loading,
    error,
    totalRewards,
    monthlyRewards,
    isRewardsAvailable: allDistributions.length > 0,
  };
}
