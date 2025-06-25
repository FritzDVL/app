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
import { useWalletClient } from "wagmi";

export function useReplyCreate() {
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  async function createReply(to: string, content: string, feedAddress: Address): Promise<ReplyType | null> {
    if (!sessionClient.data) {
      toast.error("Not logged in", { description: "Please log in to reply." });
      throw new Error("Session client is not initialized");
    }
    // 1. Generate metadata for the reply
    const metadata = textOnly({
      content,
    });

    // 2. Upload metadata to Grove
    const acl = immutable(lensMainnet.id);
    const { uri: replyUri } = await storageClient.uploadAsJson(metadata, { acl });

    // 3. Create the reply using the session client
    const notificationLoading = toast.loading("Posting reply...");
    const replyRequest = await post(sessionClient.data, {
      contentUri: uri(replyUri),
      commentOn: {
        post: postId(to),
      },
      feed: evmAddress(feedAddress),
    })
      .andThen(handleOperationWith(walletClient.data))
      .andThen(sessionClient.data.waitForTransaction)
      .andThen(txHash => fetchPost(client, { txHash }));

    if (replyRequest.isErr()) {
      toast.error("Failed to create reply", { description: String(replyRequest.error) });
      throw new Error(`Failed to create reply: ${replyRequest.error}`);
    }

    const replyPost = replyRequest.value as Post;
    toast.dismiss(notificationLoading);
    toast.success("Reply posted!");

    return transformPostToReply(replyPost, {
      name: account?.username?.localName || "",
      username: account?.username?.value || "",
      avatar: account?.metadata?.picture,
      reputation: account?.score || 0,
    });
  }

  return { createReply };
}
