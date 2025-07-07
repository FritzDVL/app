import { fetchThread } from "@/lib/fetchers/thread";
import { fetchLatestThreads } from "@/lib/supabase";
import type { Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useLatestThreads(limit: number = 5) {
  return useQuery<Thread[], Error>({
    queryKey: ["threads", "latest", limit],
    queryFn: async () => {
      const threadRecords = await fetchLatestThreads(limit);
      const transformed: Thread[] = [];
      for (const threadRecord of threadRecords) {
        try {
          const thread = await fetchThread(threadRecord.lens_feed_address);
          if (thread) transformed.push(thread);
        } catch {
          continue;
        }
      }
      return transformed;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
