import { useState } from "react";
// import { lensMainnet } from '@/lib/chains/lens-mainnet'
// import { client } from '@/lib/clients/lens-protocol-mainnet'
// import { storageClient } from '@/lib/grove'
import { fetchCommunity } from "@/lib/supabase";
import { transformFormDataToThread } from "@/lib/transformers/thread-transformers";
import { useThreadsStore } from "@/stores/threads-store";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
// import { evmAddress } from '@lens-protocol/client'
// import { createFeed, fetchFeed } from '@lens-protocol/client/actions'
// import { handleOperationWith } from '@lens-protocol/client/viem'
// import { useSessionClient } from '@lens-protocol/react'
// import { useWalletClient } from 'wagmi'
// import { feed } from '@lens-protocol/metadata'
// import { immutable } from '@lens-chain/storage-client'
import { toast } from "sonner";

export interface CreateThreadFormData {
  title: string;
  summary?: string;
  content: string;
  tags: string;
  author: Address;
}

export function useThreadCreation() {
  const [isCreating, setIsCreating] = useState(false);

  // const sessionClient = useSessionClient()
  // const walletClient = useWalletClient()
  const { addThread } = useThreadsStore();

  const createThread = async (
    communityAddress: string,
    formData: CreateThreadFormData,
    onSuccess?: (thread: Thread) => void,
  ): Promise<void> => {
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
          content: formData.content,
          tags: formData.tags,
          author: formData.author,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to create thread");
      }

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
