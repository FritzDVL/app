import { useEffect, useState } from "react";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
import { useSessionClient } from "@lens-protocol/react";

export function useThreadReplies(thread: Thread) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionClient = useSessionClient();

  useEffect(() => {
    if (!thread || sessionClient.loading) return;

    const fetchReplies = async () => {
      setLoading(true);
      setError(null);

      try {
        const repliesResponse = await getThreadReplies(thread, sessionClient.data ?? undefined);
        if (repliesResponse.success) {
          setReplies(repliesResponse.data?.replies ?? []);
        } else {
          setReplies([]);
          setError(repliesResponse.error || "Failed to fetch replies");
        }
      } catch {
        setReplies([]);
        setError("Failed to fetch replies");
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [thread.id, sessionClient.data, sessionClient.loading, thread]);

  return { data: replies, loading, error };
}
