import { getFeaturedThreads } from "@/lib/services/thread-service";
import { Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFeaturedThreads(limit: number = 5) {
  return useQuery<Thread[], Error>({
    queryKey: ["featuredThreads", limit],
    queryFn: async () => {
      const result = await getFeaturedThreads(limit);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch featured threads");
        throw new Error(result.error || "Failed to fetch featured threads");
      }
      return result.threads || [];
    },
  });
}
