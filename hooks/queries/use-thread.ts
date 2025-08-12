import { getThread } from "@/lib/services/thread/get-thread";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useThread(threadAddress: string | undefined) {
  return useQuery({
    queryKey: ["thread", threadAddress],
    queryFn: async () => {
      if (!threadAddress) return null;

      const result = await getThread(threadAddress);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch thread");
        throw new Error(result.error || "Failed to fetch thread");
      }
      return result.thread || null;
    },
    enabled: !!threadAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
