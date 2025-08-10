import { leaveCommunity } from "@/lib/services/membership/leave-community";
import { Community } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

/**
 * Custom hook to leave a Lens Protocol community.
 * Handles wallet interaction, membership state, and toast feedback.
 */
export function useLeaveCommunity(community: Community) {
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const leave = async () => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: "Please log in to leave communities.",
      });
      return;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to leave communities.",
      });
      return;
    }

    const toastIsLeaving = toast.loading("Leaving community...");
    try {
      const result = await leaveCommunity(community, sessionClient.data, walletClient.data);

      if (result.success) {
        toast.success("You have left the community!");
      } else {
        throw new Error(result.error || "Failed to leave community");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("Action Failed", {
        description: "Unable to update your membership status. Please try again.",
      });
    } finally {
      toast.dismiss(toastIsLeaving);
    }
  };

  return leave;
}
