import { decrementCommunityMembersCount } from "@/lib/supabase";
import { Community } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { leaveGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
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
    const toastIsLeaving = toast.loading("Leaving community...");
    try {
      const result = await leaveGroup(sessionClient.data, {
        group: evmAddress(community.address),
      }).andThen(handleOperationWith(walletClient.data));

      if (result.isOk()) {
        await decrementCommunityMembersCount(community.id);
        toast.success("You have left the community!");
      } else {
        throw new Error(result.error.message);
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
