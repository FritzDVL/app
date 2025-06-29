import { useState } from "react";
import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { storageClient } from "@/lib/grove";
// import { lensMainnet } from '@/lib/chains/lens-mainnet'
// import { client } from '@/lib/clients/lens-protocol-mainnet'
// import { storageClient } from '@/lib/grove'
import { fetchCommunity } from "@/lib/supabase";
import { persistRootPostId } from "@/lib/supabase";
import { transformFormDataToThread } from "@/lib/transformers/thread-transformers";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { immutable } from "@lens-chain/storage-client";
import { fetchAccount, fetchPost } from "@lens-protocol/client/actions";
import { post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";
import { Post, evmAddress, useSessionClient } from "@lens-protocol/react";
// import { feed } from '@lens-protocol/metadata'
// import { immutable } from '@lens-chain/storage-client'
import { toast } from "sonner";
import { lensTestnet } from "viem/chains";
// import { evmAddress } from '@lens-protocol/client'
// import { createFeed, fetchFeed } from '@lens-protocol/client/actions'
// import { handleOperationWith } from '@lens-protocol/client/viem'
// import { useSessionClient } from '@lens-protocol/react'
import { useWalletClient } from "wagmi";

export interface CreateThreadFormData {
  title: string;
  summary: string;
  content: string;
  tags: string;
  author: Address;
}

// Helper: Call backend API to create thread
async function createThreadApi(communityAddress: string, formData: CreateThreadFormData) {
  const response = await fetch("/api/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      communityAddress,
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      tags: formData.tags,
      author: formData.author,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || "Failed to create thread");
  }
  return data;
}

// Helper: Upload thread content to storage and post to Lens
async function uploadThreadContent(
  formData: CreateThreadFormData,
  lensFeedAddress: string,
  sessionClient: any,
  walletClient: any,
) {
  const metadata = textOnly({ content: formData.content });
  const acl = immutable(lensTestnet.id);
  const { uri } = await storageClient.uploadAsJson(metadata, { acl });
  const result = await post(sessionClient, {
    contentUri: uri,
    feed: evmAddress(lensFeedAddress),
  })
    .andThen(handleOperationWith(walletClient))
    .andThen(sessionClient.waitForTransaction)
    .andThen((txHash: unknown) => fetchPost(client, { txHash: txHash as string }));
  if (result.isErr()) {
    const errMsg =
      result.error && typeof result.error === "object" && "message" in result.error
        ? (result.error as any).message
        : String(result.error);
    throw new Error(errMsg);
  }
  return result.value as Post;
}

// Helper: Fetch author account
async function fetchThreadAuthor(authorAddress: Address) {
  const accountRequest = await fetchAccount(client, { address: evmAddress(authorAddress) });
  if (accountRequest.isErr()) {
    throw new Error(`Failed to fetch account: ${accountRequest.error.message}`);
  }
  const author = accountRequest.value;
  if (!author) {
    throw new Error(`Account not found for address: ${authorAddress}`);
  }
  return author;
}

// Helper: Fetch root post
async function fetchThreadRootPost(postId: string | undefined) {
  if (!postId) return null;
  const rootPostRequest = await fetchPost(client, { post: postId });
  if (rootPostRequest.isErr()) {
    throw new Error(`Failed to fetch root post: ${rootPostRequest.error.message}`);
  }
  return rootPostRequest.value as Post;
}

// Helper: Build thread record
function buildThreadRecord(
  formData: CreateThreadFormData,
  data: any,
  postedFeed: Post,
  community: any,
): CommunityThreadSupabase {
  return {
    id: "",
    author: formData.author,
    lens_feed_address: data.threadRecord.lens_feed_address,
    root_post_id: postedFeed.id,
    created_at: new Date().toISOString(),
    community,
    updated_at: new Date().toISOString(),
  };
}

export function useThreadCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const createThread = async (
    communityAddress: string,
    formData: CreateThreadFormData,
    onSuccess?: (thread: Thread) => void,
  ): Promise<void> => {
    if (sessionClient.error || !sessionClient.data) {
      throw new Error("Session client is not available");
    }
    setIsCreating(true);
    const loadingToastId = toast.loading("Creating Thread", { description: "Publishing thread..." });
    try {
      // 1. Call backend API to create thread
      const data = await createThreadApi(communityAddress, formData);
      // 2. Upload content and post to Lens
      const postedFeed = await uploadThreadContent(
        formData,
        data.threadRecord.lens_feed_address,
        sessionClient.data,
        walletClient.data,
      );
      // 3. Persist root post address
      if (postedFeed.id && data.threadRecord.id) {
        try {
          await persistRootPostId(data.threadRecord.id, postedFeed.id);
        } catch (e) {
          console.error("Failed to persist root post address:", e);
        }
      }
      // 4. Fetch community
      const community = await fetchCommunity(communityAddress);
      if (!community) {
        throw new Error("Community not found");
      }
      // 5. Fetch author and root post
      const author = await fetchThreadAuthor(formData.author);
      const rootPost = await fetchThreadRootPost(postedFeed.id);
      // 6. Build thread record and thread instance
      const threadRecord = buildThreadRecord(formData, data, postedFeed, community);
      const newThread = transformFormDataToThread(formData, threadRecord, communityAddress, author, rootPost);
      if (onSuccess) {
        onSuccess(newThread);
      }
      toast.success("Thread created successfully", { id: loadingToastId });
    } catch (error) {
      console.error("Error creating thread:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Publishing Failed", {
        id: loadingToastId,
        description: `Failed to publish your thread: ${errorMessage}`,
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createThread, isCreating };
}
