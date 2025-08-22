import { useState } from "react";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { updateThread } from "@/lib/services/thread/update-thread";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useThreadEditForm(thread: Thread, onSuccess?: () => void) {
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

  const walletClient = useWalletClient();
  const sessionClient = useSessionClient();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    tags: string[],
    tagInput?: string,
    setTagInput?: (v: string) => void,
  ) => {
    if (!sessionClient || !sessionClient.data) {
      toast.error("Login required to update thread");
      setIsSaving(false);
      return;
    }
    if (!walletClient || !walletClient.data) {
      toast.error("Wallet connection required to update thread");
      setIsSaving(false);
      return;
    }
    e.preventDefault();
    setIsSaving(true);
    const loadingToastId = toast.loading("Updating Thread", { description: "Saving your changes..." });
    try {
      const updatedData = { ...formData, tags: tags.join(",") };
      const result = await updateThread(thread, updatedData, sessionClient.data, walletClient.data);
      if (!result.success) {
        toast.error(result.error || "Unknown error updating thread", { id: loadingToastId });
        setIsSaving(false);
        return;
      }
      toast.success("Thread updated successfully", { id: loadingToastId });
      setIsSaving(false);
      if (onSuccess) onSuccess();
      if (setTagInput) setTagInput("");
    } catch (err: any) {
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
