"use client";

import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadReplies } from "@/hooks/queries/use-thread-replies";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadRepliesListProps {
  thread: Thread;
  community: Community;
}

export function ThreadRepliesList({ thread, community }: ThreadRepliesListProps) {
  const { data: replies = [], loading } = useThreadReplies(thread);

  if (loading) {
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
        <ThreadReplyCard key={reply.id} reply={reply} thread={thread} community={community} />
      ))}
    </div>
  );
}
