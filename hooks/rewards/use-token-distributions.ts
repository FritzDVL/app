import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { fetchTokenDistributions } from "@lens-protocol/client/actions";
import { PageSize, useSessionClient } from "@lens-protocol/react";

export interface TokenDistribution {
  id: string;
  amount: string;
  token: string;
  timestamp: string;
  type: string;
}

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

  // Transform function to convert Lens API response to our interface
  const transformDistribution = (item: any): TokenDistribution => {
    return {
      id: item.txHash || `${item.timestamp}-${Math.random()}`,
      amount: item.amount?.value || "0",
      token: item.amount?.asset?.symbol || "UNKNOWN",
      timestamp: item.timestamp || new Date().toISOString(),
      type: "Reward Distribution",
    };
  };

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

    try {
      let allItems: TokenDistribution[] = [];
      let cursor: string | null = null;
      let hasMore = true;

      // Fetch all pages
      while (hasMore) {
        const params: any = {
          pageSize: PageSize.Ten,
        };

        if (cursor) {
          params.cursor = cursor;
        }

        const result = await fetchTokenDistributions(sessionClient.data, params);

        if (result.isErr()) {
          throw new Error(result.error.message);
        }

        const { items, pageInfo } = result.value;

        // Transform and add items to our collection
        const transformedItems = items.map(transformDistribution);
        allItems = [...allItems, ...transformedItems];

        // Check if there are more pages
        hasMore = !!pageInfo.next;
        cursor = pageInfo.next;
      }

      setAllDistributions(allItems);
    } catch (err: any) {
      setError(err.message || "Failed to fetch token distributions");
      setAllDistributions([]);
    } finally {
      setLoading(false);
    }
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
