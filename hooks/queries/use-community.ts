import { fetchCommunity } from "@/lib/fetchers/community";
import { useQuery } from "@tanstack/react-query";

export function useCommunity(communityAddress: string) {
  return useQuery({
    queryKey: ["community", communityAddress],
    queryFn: () => fetchCommunity(communityAddress),
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
