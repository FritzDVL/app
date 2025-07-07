import { fetchCommunities } from "@/lib/fetchers/communities";
import type { Community } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useCommunities() {
  return useQuery<Community[], Error>({
    queryKey: ["communities", "all"],
    queryFn: fetchCommunities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
