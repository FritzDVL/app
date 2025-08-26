"use client";

import React, { useState } from "react";
import { ThreadReplies } from "@/components/thread/thread-replies";
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
      await createReply(parentId, content, thread.address, thread.id);
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
    <ThreadReplies
      replies={replies}
      replyingTo={replyingTo}
      replyContent={replyContent}
      setReplyingTo={setReplyingTo}
      setReplyContent={setReplyContent}
      handleReply={handleReply}
      rootPostId={thread.rootPost?.id || ""}
      threadAddress={thread.address}
    />
  );
}
