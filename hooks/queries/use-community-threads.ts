import { fetchThreads } from "@/lib/fetchers/threads";
import { useQuery } from "@tanstack/react-query";

export function useCommunityThreads(communityAddress: string) {
  return useQuery({
    queryKey: ["threads", communityAddress],
    queryFn: () => fetchThreads(communityAddress),
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
