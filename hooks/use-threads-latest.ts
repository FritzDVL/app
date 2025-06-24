import { useEffect, useState } from "react";
import type { Thread } from "@/types/common";

export function useThreadsLatest() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThreads() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/threads?limit=5&order=desc");
        if (!res.ok) throw new Error("Failed to fetch threads");
        const data = await res.json();
        setThreads(data.threads || []);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchThreads();
  }, []);

  return { threads, loading, error };
}
