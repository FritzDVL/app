import type { Reply as ReplyType } from "@/lib/domain/replies/types";
import { createReply } from "@/lib/services/reply/create-reply";
import { useAuthStore } from "@/stores/auth-store";
import type { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useReplyCreate() {
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const queryClient = useQueryClient();

  const createReplyWithService = async (
    to: string,
    content: string,
    feedAddress: Address,
    threadId: string,
  ): Promise<ReplyType | null> => {
    if (!sessionClient.data) {
      toast.error("Not logged in", { description: "Please log in to reply." });
      return null;
    }

    if (!walletClient.data) {
      toast.error("Wallet not connected", { description: "Please connect your wallet to reply." });
      return null;
    }

    if (!account) {
      toast.error("Account not available", { description: "Please ensure your account is loaded." });
      return null;
    }

    let loadingToastId: string | number | undefined;
    try {
      loadingToastId = toast.loading("Uploading your reply...");

      const result = await createReply(to, content, feedAddress, threadId, sessionClient.data, walletClient.data);
      if (!result.success) {
        const errorMsg = result.error || "Failed to create reply";
        if (errorMsg.includes("Not all rules satisfied")) {
          toast.error("First join community to post");
        } else {
          toast.error("Failed to create reply", { description: errorMsg });
        }
        return null;
      }

      toast.success("Reply posted!");
      await queryClient.invalidateQueries({ queryKey: ["thread-replies", threadId] });
      return result.reply || null;
    } catch (error) {
      console.error("Error creating reply:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to create reply", { description: errorMsg });
      return null;
    } finally {
      if (loadingToastId) toast.dismiss(loadingToastId);
    }
  };

  return { createReply: createReplyWithService };
}
