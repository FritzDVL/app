import { useState } from "react";
import { CreateCommunityFormData } from "@/lib/domain/communities/types";
import { createCommunity } from "@/lib/services/community-service";
import { toast } from "sonner";

// Re-export for convenience
export type { CreateCommunityFormData };

export function useCommunityCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const createCommunityAction = async (
    formData: CreateCommunityFormData,
    imageFile?: File,
    onSuccess?: (community: any) => void,
  ): Promise<void> => {
    setIsCreating(true);

    // Show loading toast
    const loadingToastId = toast.loading("Creating Community", {
      description: "Setting up your community on Lens Protocol...",
    });

    try {
      // Use the community service for all business logic
      const result = await createCommunity(formData, imageFile);

      if (!result.success) {
        toast.error("Creation Failed", {
          id: loadingToastId,
          description: result.error || "Failed to create community.",
        });
        throw new Error(result.error || "Failed to create community.");
      }

      // Use the returned community object
      const newCommunity = result.community;
      onSuccess?.(newCommunity);
      toast.success("Community Created!", {
        id: loadingToastId,
        description: `${formData.name} has been successfully created on Lens Protocol.`,
      });
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("Creation Failed", {
        id: loadingToastId,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCommunity: createCommunityAction,
    isCreating,
  };
}
