import { useEffect, useState } from "react";
import { fetchForumStats } from "@/lib/supabase";
import type { ForumStats } from "@/types/common";

/**
 * Custom hook to fetch forum-wide stats (members, threads, communities)
 */
export function useForumStats() {
  // For debugging: fetch once on mount and log error
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
        const stats = await fetchForumStats();
        setData(stats);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
        setError(e instanceof Error ? e : new Error(String(e)));
        setIsLoading(false);
        // Log error for debugging
        console.error("fetchForumStats error:", e);
      }
    }
    fetchStats();
  }, []);

  return { data, isLoading, isError, error };
}
