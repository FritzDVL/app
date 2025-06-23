import { useState } from "react";
import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { storageClient } from "@/lib/grove";
// import { lensMainnet } from '@/lib/chains/lens-mainnet'
// import { client } from '@/lib/clients/lens-protocol-mainnet'
// import { storageClient } from '@/lib/grove'
import { fetchCommunity } from "@/lib/supabase";
import { transformFormDataToThread } from "@/lib/transformers/thread-transformers";
import { useThreadsStore } from "@/stores/threads-store";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { immutable } from "@lens-chain/storage-client";
import { post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";
import { evmAddress, useSessionClient } from "@lens-protocol/react";
// import { feed } from '@lens-protocol/metadata'
// import { immutable } from '@lens-chain/storage-client'
import { toast } from "sonner";
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

export function useThreadCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const { addThread } = useThreadsStore();

  const createThread = async (
    communityAddress: string,
    formData: CreateThreadFormData,
    onSuccess?: (thread: Thread) => void,
  ): Promise<void> => {
    if (sessionClient.error || !sessionClient.data) {
      throw new Error("Session client is not available");
    }
    setIsCreating(true);

    const loadingToastId = toast.loading("Creating Thread", {
      description: "Publishing thread...",
    });

    try {
      // Call backend API to create thread
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

      // Post at feed with content.
      const metadata = textOnly({
        content: formData.content,
      });
      const acl = immutable(lensMainnet.id);
      const { uri } = await storageClient.uploadAsJson(metadata, { acl });
      const result = await post(sessionClient.data, {
        contentUri: uri,
        feed: evmAddress(data.lens_feed_address),
      }).andThen(handleOperationWith(walletClient.data));

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      const postedFeed = result.value;
      console.log("Posted feed:", postedFeed);

      // For now, create a mock thread for UI (until backend returns real thread)
      const community = await fetchCommunity(communityAddress);
      if (!community) {
        throw new Error("Community not found");
      }
      const threadRecord: CommunityThreadSupabase = {
        id: "",
        author: formData.author,
        lens_feed_address: data.feed?.address,
        created_at: new Date().toISOString(),
        community,
        updated_at: new Date().toISOString(),
      };
      const newThread = await transformFormDataToThread(formData, threadRecord, communityAddress);
      addThread(newThread);
      if (onSuccess) onSuccess(newThread);

      toast.success("Thread Published!", {
        id: loadingToastId,
        description: `"${formData.title}" has been published successfully.`,
      });
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

  return {
    createThread,
    isCreating,
  };
}
