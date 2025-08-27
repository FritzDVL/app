import { Community } from "@/lib/domain/communities/types";
import { joinCommunity } from "@/lib/services/membership/join-community";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

/**
 * Custom hook to join a Lens Protocol community.
 * Handles wallet interaction, membership state, and toast feedback.
 */
export function useJoinCommunity(community: Community) {
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const join = async () => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: "Please log in to join communities.",
      });
      return false;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to join communities.",
      });
      return false;
    }
    const toastIsJoining = toast.loading("Joining community...");
    try {
      const result = await joinCommunity(community, sessionClient.data, walletClient.data);

      if (result.success) {
        toast.success("You have joined the community!");
        return true;
      } else {
        throw new Error(result.error || "Failed to join community");
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Action Failed", {
        description: "Unable to update your membership status. Please try again.",
      });
      return false;
    } finally {
      toast.dismiss(toastIsJoining);
    }
  };

  return join;
}
