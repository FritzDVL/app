"use client";

import { useEffect, useState } from "react";
import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadReplies } from "@/hooks/queries/use-thread-replies";
import { Community } from "@/lib/domain/communities/types";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getRepliesByParentId } from "@/lib/services/reply/get-replies-by-parent-id";
import { useSessionClient } from "@lens-protocol/react";

interface ThreadRepliesListProps {
  thread: Thread;
  community: Community;
}

export function ThreadRepliesList({ thread, community }: ThreadRepliesListProps) {
  const { data: initialReplies = [], loading: initialLoading } = useThreadReplies(thread);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const sessionClient = useSessionClient();

  // Poll for new replies every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!thread.rootPost.id) return;

      // Only poll if window is focused to save resources
      if (!document.hasFocus()) return;

      try {
        const result = await getRepliesByParentId(thread.rootPost.id, sessionClient.data ?? undefined);
        if (result.success && result.replies) {
          // Simple check: if count is different, update.
          // Ideally we'd merge or check IDs, but replacing is safe for now as it's a list.
          // To avoid jitter, we could check if the last reply ID is different.
          setReplies(current => {
            if (result.replies && result.replies.length !== current.length) {
              return result.replies;
            }
            // Deep check if needed, but length is a good proxy for "new reply"
            return current;
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [thread.rootPost.id, sessionClient.data]);

  useEffect(() => {
    setReplies(initialReplies);
  }, [initialReplies]);

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading replies..." />
      </div>
    );
  }

  return (
    <div className="mt-0 space-y-0 divide-y divide-slate-100 dark:divide-gray-800">
      {replies.map(reply => (
        <ThreadReplyCard key={reply.id} reply={reply} thread={thread} community={community} />
      ))}
    </div>
  );
}
