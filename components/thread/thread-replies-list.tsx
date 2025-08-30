"use client";

import { useEffect, useState } from "react";
import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
import { useSessionClient } from "@lens-protocol/react";

interface ThreadRepliesListProps {
  thread: Thread;
}

export function ThreadRepliesList({ thread }: ThreadRepliesListProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sessionClient = useSessionClient();

  useEffect(() => {
    const doFetchReplies = async () => {
      setIsLoading(true);
      if (sessionClient.data && !sessionClient.loading) {
        try {
          const repliesResponse = await getThreadReplies(thread, sessionClient.data);
          if (repliesResponse.success) {
            setReplies(repliesResponse.data?.replies ?? []);
          }
        } catch (error) {
          console.error("Error fetching replies:", error);
        }
      }
      setIsLoading(false);
    };

    doFetchReplies();
  }, [sessionClient.data, sessionClient.loading, thread]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner text="Loading replies..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">{replies.length} Replies</h3>
      {replies.map(reply => (
        <ThreadReplyCard key={reply.id} reply={reply} thread={thread} />
      ))}
    </div>
  );
}
