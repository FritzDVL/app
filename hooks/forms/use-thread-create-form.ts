import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTagsInput } from "@/hooks/forms/use-tags-input";
import { useThreadCreation } from "@/hooks/threads/use-thread-create";
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { validateCreateThreadForm } from "@/lib/domain/threads/validation";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { toast } from "sonner";

interface UseThreadCreateFormProps {
  communityAddress: string;
  author: Address;
}

export function useThreadCreateForm({ communityAddress, author }: UseThreadCreateFormProps) {
  const [formData, setFormData] = useState<CreateThreadFormData>({
    title: "",
    summary: "",
    content: "",
    tags: "",
    author: author,
  });

  const { createThread, isCreating } = useThreadCreation();
  const { account } = useAuthStore();
  const router = useRouter();
  const { tags, setTags, tagInput, setTagInput, addTag, removeTag, handleTagInputKeyDown } = useTagsInput();

  const handleChange = (field: keyof CreateThreadFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) {
      toast.error("Authentication Error", { description: "User address not found" });
      return;
    }
    const formDataWithAuthor = {
      ...formData,
      author: account.address,
      tags: tags.join(","),
    };
    const validation = validateCreateThreadForm(formDataWithAuthor);
    if (!validation.isValid) {
      const firstError = validation.errors[0];
      toast.error("Validation Error", { description: firstError.message });
      return;
    }
    try {
      await createThread(communityAddress, formDataWithAuthor, () => {
        setFormData({ title: "", summary: "", content: "", tags: "", author: account.address });
        setTags([]);
        setTagInput("");
      });
      router.push(`/communities/${communityAddress}`);
    } catch (error) {
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
