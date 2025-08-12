import { getCommunitiesJoined } from "@/lib/services/community/get-communities-joined";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProfileJoinedCommunities(address?: Address) {
  return useQuery({
    queryKey: ["joinedCommunities", address],
    queryFn: async () => {
      if (!address) return [];
      const result = await getCommunitiesJoined(address);
      if (result.success) {
        return result.communities || [];
      } else {
        toast.error(result.error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 2,
  });
}
