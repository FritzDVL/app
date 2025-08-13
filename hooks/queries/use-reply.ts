/**
 * useReply Hook
 * React Query hook for fetching a single reply by ID
 */
import { getReply } from "@/lib/services/reply/get-reply";
import { useQuery } from "@tanstack/react-query";

export function useReply(replyId: string) {
  return useQuery({
    queryKey: ["reply", replyId],
    queryFn: async () => {
      if (!replyId) {
        throw new Error("Reply ID is required");
      }

      const result = await getReply(replyId);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch reply");
      }

      return result.reply;
    },
    enabled: !!replyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
