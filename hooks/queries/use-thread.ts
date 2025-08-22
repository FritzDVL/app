import { Thread } from "@/lib/domain/threads/types";
import { getThread } from "@/lib/services/thread/get-thread";
import { Address } from "@/types/common";
import { SessionClient } from "@lens-protocol/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useThread(threadAddress: Address, sessionClient?: SessionClient) {
  const authenticatedUserResult = sessionClient?.getAuthenticatedUser();
  const authenticatedUserAddress =
    authenticatedUserResult && authenticatedUserResult.isOk() ? authenticatedUserResult.value.address : undefined;

  return useQuery({
    queryKey: ["thread", threadAddress, authenticatedUserAddress],
    queryFn: async () => {
      let result;
      if (sessionClient) {
        result = await getThread(threadAddress, sessionClient);
      } else {
        result = await getThread(threadAddress);
      }
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
