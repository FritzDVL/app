import { useState } from "react";
import { revalidateCommunityPath } from "@/app/actions/revalidate-path";
import { Moderator } from "@/lib/domain/communities/types";
import { addModeratorToCommunity } from "@/lib/services/community/add-moderator";
import { Address } from "@/types/common";
import { toast } from "sonner";

export function useAddModerator(communityAddress: Address, sessionClient: any, walletClient: any) {
  const [loading, setLoading] = useState(false);

  const addModerator = async (newModerator: Moderator) => {
    if (!sessionClient || !sessionClient.data) {
      toast.error("Login to add moderators");
      return;
    }
    if (!walletClient || !walletClient.data) {
      toast.error("Connect your wallet to add moderators");
      return;
    }

    setLoading(true);
    try {
      const ok = await addModeratorToCommunity(
        communityAddress,
        newModerator.address,
        sessionClient.data,
        walletClient.data,
      );
      if (!ok) {
        throw new Error("Service returned false");
      }

      await revalidateCommunityPath(communityAddress);
      toast.success("Moderator added successfully!", {
        description: `${newModerator.displayName} has been added as a moderator.`,
      });
    } catch (error) {
      console.error("Error adding moderator:", error);
      toast.error("Failed to add moderator", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addModerator, loading };
}
