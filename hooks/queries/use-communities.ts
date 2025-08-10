import { getAllCommunities } from "@/lib/services/community/get-all-communities";
import type { Community } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCommunities() {
  return useQuery<Community[], Error>({
    queryKey: ["communities", "all"],
    queryFn: async () => {
      const result = await getAllCommunities("memberCount", "desc");
      if (result.success) {
        return result.communities || [];
      } else {
        toast.error(result.error);
        throw new Error(result.error);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
