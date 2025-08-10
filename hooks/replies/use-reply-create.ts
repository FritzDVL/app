import { createReply } from "@/lib/services/reply/create-reply";
import { useAuthStore } from "@/stores/auth-store";
import type { Address, Reply as ReplyType } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useReplyCreate() {
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

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

    try {
      const replyAuthor = {
        name: account.username?.localName || "",
        username: account.username?.value || "",
        avatar: account.metadata?.picture || "",
        reputation: account.score || 0,
        address: account.address,
      };

      const result = await createReply(
        to,
        content,
        feedAddress,
        threadId,
        sessionClient.data,
        walletClient.data,
        replyAuthor,
      );

      if (result.success) {
        toast.success("Reply posted!");
        return result.reply || null;
      } else {
        const errorMsg = result.error || "Failed to create reply";
        if (errorMsg.includes("Not all rules satisfied")) {
          toast.error("First join community to post");
        } else {
          toast.error("Failed to create reply", { description: errorMsg });
        }
        return null;
      }
    } catch (error) {
      console.error("Error creating reply:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to create reply", { description: errorMsg });
      return null;
    }
  };

  return { createReply: createReplyWithService };
}
