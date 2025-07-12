// import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { lensChain } from "@/lib/chains/lens";
import { client } from "@/lib/clients/lens-protocol";
import { storageClient } from "@/lib/grove/client";
import { incrementThreadRepliesCount } from "@/lib/supabase";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { useAuthStore } from "@/stores/auth-store";
import type { Address, Reply as ReplyType } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { Post, evmAddress, postId, uri } from "@lens-protocol/client";
import { fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useReplyCreate() {
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  // --- Helpers ---
  function getReplyMetadata(content: string) {
    return textOnly({ content });
  }

  async function uploadReplyMetadata(metadata: any) {
    const acl = immutable(lensChain.id);
    const { uri: replyUri } = await storageClient.uploadAsJson(metadata, { acl });
    return replyUri;
  }

  async function createReplyOnLens(replyUri: string, to: string, feedAddress: Address) {
    if (!sessionClient.data) {
      toast.error("Not logged in", { description: "Please log in to reply." });
      throw new Error("Session client is not initialized");
    }
    const notificationLoading = toast.loading("Posting reply...");
    const replyRequest = await post(sessionClient.data, {
      contentUri: uri(replyUri),
      commentOn: { post: postId(to) },
      feed: evmAddress(feedAddress),
    })
      .andThen(handleOperationWith(walletClient.data))
      .andThen(sessionClient.data.waitForTransaction)
      .andThen(txHash => fetchPost(client, { txHash }));
    toast.dismiss(notificationLoading);
    if (replyRequest.isErr()) {
      const errorMsg = String(replyRequest.error);
      if (errorMsg.includes("Not all rules satisfied")) {
        toast.error("First join community to post");
      } else {
        toast.error("Failed to create reply", { description: errorMsg });
      }
      throw new Error(`Failed to create reply: ${errorMsg}`);
    }
    toast.success("Reply posted!");
    return replyRequest.value as Post;
  }

  function buildReplyObject(replyPost: Post) {
    return transformPostToReply(replyPost, {
      name: account?.username?.localName || "",
      username: account?.username?.value || "",
      avatar: account?.metadata?.picture,
      reputation: account?.score || 0,
      address: replyPost.author.address,
    });
  }

  /**
   * Increments replies_count for a thread in community_threads by threadId.
   * Does not throw if increment fails.
   */
  async function safeIncrementRepliesCount(threadId?: string) {
    if (!threadId) return;
    try {
      await incrementThreadRepliesCount(threadId);
    } catch (e) {
      // Optionally log or toast error, but don't block reply creation
      console.error("Failed to increment replies_count", e);
    }
  }

  // --- Main function ---
  async function createReply(
    to: string,
    content: string,
    feedAddress: Address,
    threadId: string,
  ): Promise<ReplyType | null> {
    try {
      const metadata = getReplyMetadata(content);
      const replyUri = await uploadReplyMetadata(metadata);
      const replyPost = await createReplyOnLens(replyUri, to, feedAddress);
      const reply = buildReplyObject(replyPost);
      await safeIncrementRepliesCount(threadId);
      return reply;
    } catch (error) {
      console.error("Error creating reply:", error);
      return null;
    }
  }

  return { createReply };
}
