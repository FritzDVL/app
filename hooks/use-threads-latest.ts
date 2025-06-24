import { useEffect, useState } from "react";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchLatestThreads } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import type { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";

export function useThreadsLatest(limit: number = 5) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndTransformThreads() {
      setLoading(true);
      setError(null);
      try {
        const threadRecords = await fetchLatestThreads(limit);
        const transformed: Thread[] = [];
        for (const threadRecord of threadRecords) {
          try {
            const feedResult = await fetchFeed(client, {
              feed: evmAddress(threadRecord.lens_feed_address),
            });
            if (feedResult.isErr() || !feedResult.value) continue;
            const thread = await transformFeedToThread(feedResult.value, threadRecord);
            transformed.push(thread);
          } catch {
            continue;
          }
        }
        setThreads(transformed);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchAndTransformThreads();
  }, [limit]);

  return { threads, loading, error };
}
