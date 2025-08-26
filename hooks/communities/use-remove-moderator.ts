import { useState } from "react";
import { revalidateCommunityPath } from "@/app/actions/revalidate-path";
import { Moderator } from "@/lib/domain/communities/types";
import { removeModeratorFromCommunity } from "@/lib/services/community/remove-moderator";
import { Address } from "@/types/common";
import { toast } from "sonner";

export function useRemoveModerator(communityAddress: Address, sessionClient: any, walletClient: any) {
  const [loading, setLoading] = useState(false);

  const removeModerator = async (moderator: Moderator) => {
    setLoading(true);
    try {
      if (!sessionClient || !sessionClient.data) {
        toast.error("Login to add moderators");
        return;
      }
      if (!walletClient || !walletClient.data) {
        toast.error("Connect your wallet to add moderators");
        return;
      }
      const ok = await removeModeratorFromCommunity(
        communityAddress,
        moderator.address as Address,
        sessionClient.data,
        walletClient.data,
      );
      if (!ok) {
        throw new Error("Service returned false");
      }
      await revalidateCommunityPath(communityAddress);
      toast.success("Moderator removed successfully!", {
        description: "The moderator has been removed from your community.",
      });
    } catch (error) {
      console.error("Error removing moderator:", error);
      toast.error("Failed to remove moderator", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { removeModerator, loading };
}
