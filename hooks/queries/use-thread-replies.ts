import { fetchRepliesPaginated } from "@/lib/fetchers/replies";
import { PaginatedRepliesResult, ThreadReplyWithDepth } from "@/types/common";
import { PageSize } from "@lens-protocol/client";
import { useQuery } from "@tanstack/react-query";

export function useThreadReplies(threadAddress: string | undefined, cursor: string | null, threadRootPostId?: string) {
  return useQuery<PaginatedRepliesResult, Error, { replies: ThreadReplyWithDepth[]; pageInfo: any }>({
    queryKey: ["replies", threadAddress, cursor, threadRootPostId],
    queryFn: () => fetchRepliesPaginated(String(threadAddress), PageSize.Fifty, cursor),
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
