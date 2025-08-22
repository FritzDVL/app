import { useState } from "react";
import { Thread } from "@/lib/domain/threads/types";
import { UpdateThreadData, updateThread } from "@/lib/services/thread/update-thread";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useThreadUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: sessionClient } = useSessionClient();
  const walletClient = useWalletClient();

  const updateThreadWithService = async (thread: Thread, updateData: UpdateThreadData): Promise<void> => {
    if (!sessionClient || !walletClient.data) {
      toast.error("Connection required", {
        description: "Please connect your wallet and sign in to edit this thread.",
      });
      return;
    }

    setIsUpdating(true);

    const loadingToastId = toast.loading("Updating Thread", { description: "Saving your changes..." });
    try {
      const result = await updateThread(thread, updateData, sessionClient, walletClient.data!);

      if (!result.success) {
        throw new Error(result.error || "Failed to update thread");
      }

      toast.success("Thread updated successfully", { id: loadingToastId });
    } catch (error) {
      console.error("Error updating thread:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Update Failed", {
        id: loadingToastId,
        description: `Failed to update your thread: ${errorMessage}`,
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateThread: updateThreadWithService, isUpdating };
}
