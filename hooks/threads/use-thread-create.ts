import { useState } from "react";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { createThread } from "@/lib/services/thread-service";
import { Thread } from "@/types/common";
import { toast } from "sonner";

export function useThreadCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const createThreadWithService = async (
    communityAddress: string,
    formData: CreateThreadFormData,
    onSuccess?: (thread: Thread) => void,
  ): Promise<void> => {
    setIsCreating(true);
    const loadingToastId = toast.loading("Creating Thread", { description: "Publishing thread..." });
    try {
      const result = await createThread(communityAddress, formData);
      if (result.success) {
        toast.success("Thread created successfully", { id: loadingToastId });
        if (onSuccess && result.thread) {
          onSuccess(result.thread);
        }
      } else {
        throw new Error(result.error || "Failed to create thread");
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
