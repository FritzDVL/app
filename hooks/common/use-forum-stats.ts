import { useEffect, useState } from "react";
import { getForumStatistics } from "@/lib/services/stats-service";
import type { ForumStats } from "@/types/common";

/**
 * Custom hook to fetch forum-wide stats (members, threads, communities)
 */
export function useForumStats() {
  const [data, setData] = useState<ForumStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await getForumStatistics();

        if (result.success && result.stats) {
          setData(result.stats);
          setIsLoading(false);
        } else {
          setIsError(true);
          setError(new Error(result.error || "Failed to fetch forum statistics"));
          setIsLoading(false);
          console.error("fetchForumStats error:", result.error);
        }
      } catch (e) {
        setIsError(true);
        setError(e instanceof Error ? e : new Error(String(e)));
        setIsLoading(false);
        console.error("fetchForumStats error:", e);
      }
    }
    fetchStats();
  }, []);

  return { data, isLoading, isError, error };
}
