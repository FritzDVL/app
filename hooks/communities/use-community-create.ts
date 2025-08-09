import { useState } from "react";
import { CreateCommunityFormData } from "@/lib/domain/communities/types";
import { toast } from "sonner";

export function useCommunityCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const createCommunity = async (
    formData: CreateCommunityFormData,
    onSuccess?: (community: any) => void, // Use 'any' since the API returns a plain object
  ): Promise<void> => {
    setIsCreating(true);

    // Show loading toast
    const loadingToastId = toast.loading("Creating Community", {
      description: "Setting up your community on Lens Protocol...",
    });

    try {
      // Call API route to create the community
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "community",
          name: formData.name,
          description: formData.description,
          adminAddress: formData.adminAddress,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
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
    createCommunity,
    isCreating,
  };
}
