import { useState } from "react";
import { updateCommunityAction } from "@/app/actions/update-community";
import { Community } from "@/lib/domain/communities/types";
import { toast } from "sonner";

export interface EditCommunityFormData {
  name: string;
  description: string;
  logo: File | null;
}

export function useCommunityEditForm(community: Community) {
  const [formData, setFormData] = useState<EditCommunityFormData>({
    name: community.name,
    description: community.description,
    logo: null,
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
      // Prepare FormData for server action
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      if (formData.logo) {
        form.append("logo", formData.logo);
      }

      // Show loading toast
      const loadingToastId = toast.loading("Updating Community", {
        description: "Updating up your community...",
      });
console.log("Submitting community update:", formData);
      const result = await updateCommunityAction(community, form);

      if (!result.success) {
        toast.error("Failed to update community", {
          description: result.error || "Please try again later.",
        });
        setLoading(false);
        return;
      }

      toast.success("Community updated!", {
        id: loadingToastId,
        description: "Your changes have been saved.",
      });

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
    previewUrl,
    setPreviewUrl,
    loading,
    handleChange,
    handleImageChange,
    clearImage,
    handleSubmit,
  };
}
