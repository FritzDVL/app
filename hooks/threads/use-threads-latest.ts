import { useEffect, useState } from "react";
import { fetchLatestThreads } from "@/lib/external/supabase/threads";
import { fetchThread } from "@/lib/fetchers/thread";
import type { Thread } from "@/types/common";

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
            const thread = await fetchThread(threadRecord.lens_feed_address);
            if (!thread) continue;
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
