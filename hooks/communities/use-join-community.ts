import { Community } from "@/lib/domain/communities/types";
import { joinCommunity } from "@/lib/services/membership/join-community";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { usePublicClient, useWalletClient } from "wagmi";

/**
 * Custom hook to join a Lens Protocol community.
 * Handles wallet interaction, membership state, and toast feedback.
 */
export function useJoinCommunity(community: Community) {
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const publicClient = usePublicClient();

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
    if (!publicClient) {
      toast.error("Network error", {
        description: "Unable to connect to the blockchain network.",
      });
      return false;
    }

    const toastIsJoining = toast.loading("Verifying requirements...");
    try {
      const result = await joinCommunity(community, sessionClient.data, walletClient.data, publicClient);

      if (result.success) {
        toast.success("You have joined the community!");
        return true;
      } else {
        // Show specific verification error if available
        if (result.verificationError) {
          toast.error("Requirements Not Met", {
            description: result.error,
            duration: 5000, // Show longer for readability
          });
        } else {
          throw new Error(result.error || "Failed to join community");
        }
        return false;
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("Action Failed", {
        description: error instanceof Error ? error.message : "Unable to update your membership status.",
      });
      return false;
    } finally {
      toast.dismiss(toastIsJoining);
    }
  };

  return join;
}
