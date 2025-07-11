import { incrementCommunityMembersCount } from "@/lib/supabase";
import { Community } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
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
      return;
    }
    const toastIsJoining = toast.loading("Joining community...");
    try {
      const result = await joinGroup(sessionClient.data, {
        group: evmAddress(community.address),
      }).andThen(handleOperationWith(walletClient.data));

      if (result.isOk()) {
        await incrementCommunityMembersCount(community.id);
        toast.success("You have joined the community!");
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      toast.error("Action Failed", {
        description: "Unable to update your membership status. Please try again.",
      });
    } finally {
      toast.dismiss(toastIsJoining);
    }
  };

  return join;
}
