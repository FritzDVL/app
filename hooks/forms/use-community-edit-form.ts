import { useState } from "react";
import { revalidateCommunityAndListPaths } from "@/app/actions/revalidate-path";
import { Community } from "@/lib/domain/communities/types";
import { updateCommunity } from "@/lib/services/community/update-community";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

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

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

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
    if (!sessionClient.data) {
      toast.error("You must be logged in to update the community.");
      return;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected. Please connect your wallet.");
      return;
    }
    setLoading(true);
    const data = {
      name: formData.name,
      description: formData.description,
      logo: formData.logo,
    };
    const loadingToastId = toast.loading("Updating Community", {
      description: "Updating your community...",
    });
    try {
      const result = await updateCommunity(community, data, sessionClient.data, walletClient.data);
      if (result.success) {
        if (community?.address) {
          await revalidateCommunityAndListPaths(community.address);
        }
        toast.success("Community updated!", {
          id: loadingToastId,
          description: "Your changes have been saved.",
        });
      } else {
        toast.error("Failed to update community", {
          id: loadingToastId,
          description: result.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("Failed to update community", {
        description: "Please try again later.",
      });
      toast.dismiss(loadingToastId);
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
