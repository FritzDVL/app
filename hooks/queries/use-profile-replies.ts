import { getLatestRepliesByAuthor } from "@/lib/services/reply-service";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProfileReplies(address?: Address) {
  return useQuery({
    queryKey: ["latestReplies", address],
    queryFn: async () => {
      if (!address) return [];
      const result = await getLatestRepliesByAuthor(address, 10);
      if (result.success) {
        return result.replies || [];
      } else {
        toast.error(result.error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
