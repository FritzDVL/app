import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTagsInput } from "@/hooks/forms/use-tags-input";
import { Community } from "@/lib/domain/communities/types";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { validateCreateThreadForm } from "@/lib/domain/threads/validation";
import { createThread as createThreadService } from "@/lib/services/thread/create-thread";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

interface UseThreadCreateFormProps {
  community: Community;
  author: Address;
}

export function useThreadCreateForm({ community, author }: UseThreadCreateFormProps) {
  const [formData, setFormData] = useState<CreateThreadFormData>({
    title: "",
    summary: "",
    content: "",
    tags: "",
    author: author,
  });
  const [isCreating, setIsCreating] = useState(false);

  const { tags, setTags, tagInput, setTagInput, addTag, removeTag, handleTagInputKeyDown } = useTagsInput();
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const router = useRouter();

  const handleChange = (field: keyof CreateThreadFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent, customFormData?: CreateThreadFormData) => {
    e.preventDefault();
    if (!account?.address) {
      toast.error("Authentication Error", { description: "User address not found" });
      return;
    }
    if (!sessionClient.data || sessionClient.loading) {
      toast.error("Authentication required", { description: "Please sign in to create a thread." });
      throw new Error("Authentication required");
    }
    if (!walletClient.data) {
      toast.error("Connection required", {
        description: "Please connect your wallet and sign in to create a thread.",
      });
      throw new Error("Wallet connection required");
    }

    const formDataToUse = customFormData ?? {
      ...formData,
      author: account.address,
      tags: tags.join(","),
    };
    const validation = validateCreateThreadForm(formDataToUse);
    if (!validation.isValid) {
      const firstError = validation.errors[0];
      toast.error("Validation Error", { description: firstError.message });
      return;
    }
    const loadingToast = toast.loading("Creating thread...", { description: "Your thread is being created." });
    try {
      setIsCreating(true);
      await createThreadService(community, formDataToUse, sessionClient.data, walletClient.data!);
      setIsCreating(false);
      toast.success("Thread created!", { description: "Your thread was successfully created.", id: loadingToast });
      // Reset form after successful submission
      setFormData({ title: "", summary: "", content: "", tags: "", author: account.address });
      setTags([]);
      setTagInput("");
      router.push(`/communities/${community.group.address}`);
    } catch (error) {
      setIsCreating(false);
      toast.error("Failed to create thread", {
        description: "An error occurred while creating your thread.",
        id: loadingToast,
      });
      console.error("Error in handleSubmit:", error);
    }
  };

  return {
    formData,
    setFormData,
    tags,
    setTags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    handleTagInputKeyDown,
    handleChange,
    handleSubmit,
    isCreating,
  };
}
