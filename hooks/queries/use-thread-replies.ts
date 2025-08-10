import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
import { PaginatedRepliesResult, ThreadReplyWithDepth } from "@/types/common";
import { PageSize } from "@lens-protocol/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useThreadReplies(threadAddress: string | undefined, cursor: string | null, threadRootPostId?: string) {
  return useQuery<PaginatedRepliesResult, Error, { replies: ThreadReplyWithDepth[]; pageInfo: any }>({
    queryKey: ["replies", threadAddress, cursor, threadRootPostId],
    queryFn: async () => {
      const result = await getThreadReplies(String(threadAddress), PageSize.Fifty, cursor);
      if (result.success && result.data) {
        // Convert service response to expected type
        return {
          items: result.data.replies,
          pageInfo: result.data.pageInfo,
        };
      } else {
        toast.error(result.error);
        throw new Error(result.error);
      }
    },
    enabled: !!threadAddress,
    staleTime: 1000 * 60 * 5, // Increased to 5 minutes for better performance
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: 2, // Retry failed requests twice
    select: (flatReplies: PaginatedRepliesResult) => {
      if (!threadRootPostId) {
        return { replies: [], pageInfo: flatReplies.pageInfo };
      }
      const rootPostId = String(threadRootPostId);
      const repliesOnly = flatReplies.items.filter(r => r.id !== rootPostId);
      repliesOnly.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      return {
        replies: repliesOnly,
        pageInfo: flatReplies.pageInfo,
      };
    },
  });
}
