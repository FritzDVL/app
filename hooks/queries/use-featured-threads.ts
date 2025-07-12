import { fetchFeaturedThreadsOptimized } from "@/lib/fetchers/threads";
import { Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useFeaturedThreads(limit: number = 5) {
  return useQuery<Thread[], Error>({
    queryKey: ["featuredThreads", limit],
    queryFn: () => fetchFeaturedThreadsOptimized(limit),
  });
}
