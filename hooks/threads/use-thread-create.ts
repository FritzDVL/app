import { useState } from "react";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { Thread } from "@/lib/domain/threads/types";
import { createThread } from "@/lib/services/thread/create-thread";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useThreadCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: sessionClient } = useSessionClient();
  const walletClient = useWalletClient();

  const createThreadWithService = async (
    communityAddress: string,
    formData: CreateThreadFormData,
    onSuccess?: (thread: Thread) => void,
  ): Promise<void> => {
    if (!sessionClient || !walletClient.data) {
      toast.error("Connection required", {
        description: "Please connect your wallet and sign in to create a thread.",
      });
      return;
    }

    setIsCreating(true);

    const loadingToastId = toast.loading("Creating Thread", { description: "Publishing thread..." });
    try {
      const result = await createThread(communityAddress, formData, sessionClient, walletClient.data!);

      if (!result.success) {
        throw new Error(result.error || "Failed to create thread");
      }

      toast.success("Thread created successfully", { id: loadingToastId });
      if (onSuccess && result.thread) {
        onSuccess(result.thread);
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Publishing Failed", {
        id: loadingToastId,
        description: `Failed to publish your thread: ${errorMessage}`,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createThread: createThreadWithService, isCreating };
}
