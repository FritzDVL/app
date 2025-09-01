import { Community } from "@/lib/domain/communities/types";
import { requestGroupMembership } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useRequestJoinCommunity(community: Community) {
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const requestJoin = async () => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: "Please log in to request to join this community.",
      });
      return false;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to request to join this community.",
      });
      return false;
    }
    const toastIsJoining = toast.loading("Requesting to join community...");
    try {
      const result = await requestGroupMembership(sessionClient.data, {
        group: community.group.address,
      })
        .andThen(handleOperationWith(walletClient.data))
        .andThen(sessionClient.data.waitForTransaction);

      if (result.isErr()) {
        throw new Error(result.error.message || "Failed to request to join community");
      } else {
        toast.success("Request sent!", {
          description: "Your request to join this community has been submitted.",
        });
        return true;
      }
    } catch (error) {
      console.error("Error requesting to join community:", error);
      toast.error("Request Failed", {
        description: "Unable to send your join request. Please try again.",
      });
      return false;
    } finally {
      toast.dismiss(toastIsJoining);
    }
  };

  return requestJoin;
}
