import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
import { useQuery } from "@tanstack/react-query";

export function useThreadReplies(thread: Thread) {
  return useQuery<Reply[]>({
    queryKey: ["thread-replies", thread.id],
    queryFn: async () => {
      const repliesResponse = await getThreadReplies(thread);
      if (!repliesResponse.success) return [];
      return repliesResponse.data?.replies ?? [];
    },
    enabled: !!thread,
  });
}
