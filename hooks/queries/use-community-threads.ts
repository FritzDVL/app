import { getCommunityThreads } from "@/lib/services/thread-service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCommunityThreads(communityAddress: string) {
  return useQuery({
    queryKey: ["threads", communityAddress],
    queryFn: async () => {
      const result = await getCommunityThreads(communityAddress);
      if (!result.success) {
        toast.error(result.error || "Failed to fetch community threads");
        throw new Error(result.error || "Failed to fetch community threads");
      }
      return result.threads || [];
    },
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
