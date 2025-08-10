import { Community } from "@/lib/domain/communities/types";
import { getFeaturedCommunities } from "@/lib/services/community/get-featured-communities";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFeaturedCommunities() {
  return useQuery<Community[], Error>({
    queryKey: ["communities", "featured"],
    queryFn: async () => {
      const result = await getFeaturedCommunities();
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
