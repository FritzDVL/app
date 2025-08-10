import { getLatestThreads } from "@/lib/services/thread-service";
import type { Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLatestThreads(limit: number = 5) {
  return useQuery<Thread[], Error>({
    queryKey: ["threads", "latest", limit],
    queryFn: async () => {
      const result = await getLatestThreads(limit);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch latest threads");
        throw new Error(result.error || "Failed to fetch latest threads");
      }
      return result.threads || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: 2, // Retry failed requests twice
  });
}
