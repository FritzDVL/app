import { useState } from "react";
import { Community, CreateCommunityFormData } from "@/lib/domain/communities/types";
import { toast } from "sonner";

export function useCommunityCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const createCommunity = async (formData: CreateCommunityFormData, imageFile?: File): Promise<Community> => {
    setIsCreating(true);
    const loadingToastId = toast.loading("Creating Community", {
      description: "Setting up your community on Lens Protocol...",
    });
    try {
      // Create FormData for API call
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      apiFormData.append("adminAddress", formData.adminAddress);
      if (imageFile) {
        apiFormData.append("image", imageFile);
      }
      // Call the API route
      const response = await fetch("/api/communities", {
        method: "POST",
        body: apiFormData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error("Creation Failed", {
          id: loadingToastId,
          description: result.error || "Failed to create community.",
        });
        throw new Error(result.error || "Failed to create community.");
      }
      toast.success("Community Created!", {
        id: loadingToastId,
        description: `${formData.name} has been successfully created on Lens Protocol.`,
      });

      return result.community as Community;
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
