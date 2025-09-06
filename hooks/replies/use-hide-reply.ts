import { useState } from "react";
import { hideReply, unhideReply } from "@lens-protocol/client/actions";
import { PostId, postId, useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

interface UseHideReplyReturn {
  hideReplyAction: (replyId: PostId) => Promise<boolean>;
  unhideReplyAction: (replyId: PostId) => Promise<boolean>;
  isLoading: boolean;
}

export function useHideReply(): UseHideReplyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const hideReplyAction = async (replyId: PostId): Promise<boolean> => {
    if (!sessionClient.data) {
      toast.error("Not authenticated", {
        description: "Please connect your account to hide replies.",
      });
      return false;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to hide replies.",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const result = await hideReply(sessionClient.data, {
        post: postId(replyId),
      });

      if (result.isErr()) {
        console.error("Error hiding reply:", result.error);
        toast.error("Failed to hide reply", {
          description: result.error.message || "Please try again later.",
        });
        return false;
      }

      toast.success("Reply hidden successfully", {
        description: "The reply has been hidden from the community.",
      });

      return true;
    } catch (error) {
      console.error("Error hiding reply:", error);
      toast.error("Failed to hide reply", {
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unhideReplyAction = async (replyId: PostId): Promise<boolean> => {
    if (!sessionClient.data) {
      toast.error("Not authenticated", {
        description: "Please connect your account to unhide replies.",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const result = await unhideReply(sessionClient.data, {
        post: postId(replyId),
      });

      if (result.isErr()) {
        console.error("Error unhiding reply:", result.error);
        toast.error("Failed to unhide reply", {
          description: result.error.message || "Please try again later.",
        });
        return false;
      }

      toast.success("Reply unhidden successfully", {
        description: "The reply is now visible to the community.",
      });

      return true;
    } catch (error) {
      console.error("Error unhiding reply:", error);
      toast.error("Failed to unhide reply", {
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hideReplyAction,
    unhideReplyAction,
    isLoading,
  };
}
