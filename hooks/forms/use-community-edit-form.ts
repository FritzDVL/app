import { useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { updateCommunity } from "@/lib/services/community/update-community";
import { toast } from "sonner";

export function useCommunityEditForm(community: Community) {
  const [formData, setFormData] = useState({
    name: community.name,
    description: community.description,
    logo: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare update payload
      const payload = {
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
      };
      // Call update service
      const result = await updateCommunity(community.address, payload);
      if (!result.success) {
        toast.error("Failed to update community", {
          description: result.error || "Please try again later.",
        });
        setLoading(false);
        return;
      }
      toast.success("Community updated successfully!", {
        description: "Your changes have been saved.",
      });
      // Optionally: update UI state, refetch, etc.
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Failed to update community", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    previewUrl,
    setPreviewUrl,
    loading,
    handleChange,
    handleImageChange,
    clearImage,
    handleSubmit,
  };
}
