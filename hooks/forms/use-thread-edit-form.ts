import { useState } from "react";
import { revalidateCommunityAndListPaths, revalidateThreadAndListPaths } from "@/app/actions/revalidate-path";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { updateThread } from "@/lib/services/thread/update-thread";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useThreadEditForm(thread: Thread, onSuccess?: () => void) {
  // Initialize form state with thread data
  const [formData, setFormData] = useState({
    title: thread.title,
    summary: thread.summary,
    content: stripThreadArticleFormatting(
      thread?.rootPost?.metadata &&
        typeof thread.rootPost.metadata === "object" &&
        "content" in thread.rootPost.metadata
        ? (thread.rootPost.metadata.content ?? "")
        : "",
    ),
  });
  const [isSaving, setIsSaving] = useState(false);

  // Wallet and session clients for authentication and signing
  const walletClient = useWalletClient();
  const sessionClient = useSessionClient();

  // Update a field in the form state
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission for editing a thread
  const handleSubmit = async (
    e: React.FormEvent,
    tags: string[],
    tagInput?: string,
    setTagInput?: (v: string) => void,
  ) => {
    e.preventDefault();
    setIsSaving(true);

    // Check for valid session
    if (!sessionClient || !sessionClient.data) {
      toast.error("Login required to update thread");
      setIsSaving(false);
      return;
    }
    // Check for connected wallet
    if (!walletClient || !walletClient.data) {
      toast.error("Wallet connection required to update thread");
      setIsSaving(false);
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading("Updating Thread", { description: "Saving your changes..." });

    try {
      // Prepare updated thread data
      const updatedData = { ...formData, tags: tags.join(",") };
      // Attempt to update the thread
      const result = await updateThread(thread, updatedData, sessionClient.data, walletClient.data);

      // Handle update failure
      if (!result.success) {
        toast.error(result.error || "Unknown error updating thread", { id: loadingToastId });
        setIsSaving(false);
        return;
      }

      // Revalidate the thread path after successful update
      await revalidateThreadAndListPaths(thread.address);

      // Show success toast and reset state
      toast.success("Thread updated successfully", { id: loadingToastId });
      setIsSaving(false);
      if (onSuccess) onSuccess();
      if (setTagInput) setTagInput("");
    } catch (err: any) {
      // Handle unexpected errors
      toast.error(err.message || "Unknown error updating thread", { id: loadingToastId });
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    isSaving,
    handleChange,
    handleSubmit,
  };
}
