import { getCommunity } from "@/lib/services/community/get-community";
import { Address } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useCommunity(address: Address) {
  return useQuery({
    queryKey: ["community", address],
    queryFn: () => getCommunity(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
