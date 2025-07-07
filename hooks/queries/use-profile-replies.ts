import { fetchLatestRepliesByAuthor } from "@/lib/fetchers/replies";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useProfileReplies(address?: Address) {
  return useQuery({
    queryKey: ["latestReplies", address],
    queryFn: async () => {
      if (!address) return [];
      return fetchLatestRepliesByAuthor(address, 10);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
