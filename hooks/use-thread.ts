import { useEffect, useState } from "react";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchThread } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import type { Address, Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";

export function useThread(threadAddress: Address) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch thread record from Supabase
        const threadRecord = await fetchThread(threadAddress);
        if (!threadRecord) {
          setError("Thread not found in database");
          setLoading(false);
          return;
        }
        // Fetch Lens feed
        const result = await fetchFeed(client, {
          feed: evmAddress(threadAddress),
        });
        if (result.isErr() || !result.value) {
          setError(result.isErr() ? String(result.error) : "Failed to fetch thread");
          setLoading(false);
          return;
        }
        const feed = result.value;
        if (!feed) {
          setError("Feed not found");
          setLoading(false);
          return;
        }

        const threadObj = await transformFeedToThread(feed, threadRecord);
        setThread(threadObj);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (!threadAddress) return;
    fetchThreadData();
  }, [threadAddress]);

  return { thread, loading, error };
}
