import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
import { useSessionClient } from "@lens-protocol/react";
import { useQuery } from "@tanstack/react-query";

export function useThreadReplies(thread: Thread) {
  const sessionClient = useSessionClient();
  const enabled = !!thread && !sessionClient.loading;

  const sessionKey = sessionClient.data ? JSON.stringify(sessionClient.data.getAuthenticatedUser()) : "no-session";

  return useQuery<Reply[]>({
    queryKey: ["thread-replies", thread.id, sessionKey],
    queryFn: async () => {
      const repliesResponse = await getThreadReplies(thread, sessionClient.data ?? undefined);
      if (!repliesResponse.success) return [];
      return repliesResponse.data?.replies ?? [];
    },
    enabled,
  });
}
