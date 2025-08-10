import { useEffect, useState } from "react";
import { getLatestThreads } from "@/lib/services/thread/get-latest-threads";
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
        const result = await getLatestThreads(limit);
        if (result.success) {
          setThreads(result.threads || []);
        } else {
          setError(result.error || "Failed to fetch threads");
        }
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
