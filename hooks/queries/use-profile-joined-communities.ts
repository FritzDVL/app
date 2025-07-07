import { fetchCommunitiesJoined } from "@/lib/fetchers/communities";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useProfileJoinedCommunities(address?: Address) {
  return useQuery({
    queryKey: ["joinedCommunities", address],
    queryFn: async () => {
      if (!address) return [];
      return fetchCommunitiesJoined(address);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 2,
  });
}
