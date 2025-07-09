import { fetchLatestThreadsOptimized } from "@/lib/fetchers/threads";
import type { Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useLatestThreads(limit: number = 5) {
  return useQuery<Thread[], Error>({
    queryKey: ["threads", "latest", limit],
    queryFn: () => fetchLatestThreadsOptimized(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: 2, // Retry failed requests twice
  });
}
