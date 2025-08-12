import { getCommunity } from "@/lib/services/community/get-community";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCommunity(communityAddress: string) {
  return useQuery({
    queryKey: ["community", communityAddress],
    queryFn: async () => {
      const result = await getCommunity(communityAddress);
      if (result.success) {
        return result.community;
      } else {
        toast.error(result.error);
        return null;
      }
    },
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
