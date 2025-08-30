"use client";

import React, { useState } from "react";
import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadReplies } from "@/hooks/queries/use-thread-replies";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadRepliesListProps {
  thread: Thread;
}

export function ThreadRepliesList({ thread }: ThreadRepliesListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const { createReply } = useReplyCreate();
  const { data: replies = [], isLoading } = useThreadReplies(thread);

  const handleReply = async (parentId: string, content: string) => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (parentId && content) {
      await createReply(parentId, content, thread.feed.address, thread.id);
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, [parentId]: "" }));
    }
  };

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
        <ThreadReplyCard
          key={reply.id}
          reply={reply}
          replyingTo={replyingTo}
          replyContent={replyContent}
          setReplyingTo={setReplyingTo}
          setReplyContent={setReplyContent}
          handleReply={handleReply}
          rootPostId={thread.rootPost?.id || ""}
          threadAddress={thread.feed.address}
        />
      ))}
    </div>
  );
}
