import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { storageClient } from "@/lib/grove";
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
import { lensTestnet } from "viem/chains";
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
    const acl = immutable(lensTestnet.id);
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
      toast.error("Failed to create reply", { description: String(replyRequest.error) });
      throw new Error(`Failed to create reply: ${replyRequest.error}`);
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

  // --- Main function ---
  async function createReply(to: string, content: string, feedAddress: Address): Promise<ReplyType | null> {
    const metadata = getReplyMetadata(content);
    const replyUri = await uploadReplyMetadata(metadata);
    const replyPost = await createReplyOnLens(replyUri, to, feedAddress);
    const reply = buildReplyObject(replyPost);
    return reply;
  }

  return { createReply };
}
