import { getThread } from "@/lib/services/thread/get-thread";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useThread(threadAddress: Address) {
  const sessionClient = useSessionClient();
  const sessionData = sessionClient.data;
  const authenticatedUserResult = sessionData?.getAuthenticatedUser();
  const authenticatedUserAddress =
    authenticatedUserResult && authenticatedUserResult.isOk() ? authenticatedUserResult.value.address : undefined;

  return useQuery({
    queryKey: ["thread", threadAddress, authenticatedUserAddress],
    queryFn: async () => {
      let result;
      if (sessionData) {
        result = await getThread(threadAddress, sessionData);
      } else {
        result = await getThread(threadAddress);
      }
      if (!result.success) {
        toast.error(result.error || "Failed to fetch thread");
        throw new Error(result.error || "Failed to fetch thread");
      }
      return result.thread || null;
    },
    enabled: !!threadAddress && !sessionClient.loading,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
