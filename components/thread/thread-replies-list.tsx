"use client";

import React, { useState } from "react";
import { ThreadReplies } from "@/components/thread/thread-replies";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";

export function ThreadRepliesList({ thread, replies }: { thread: Thread; replies: Reply[] }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const { createReply } = useReplyCreate();

  const handleReply = async (parentId: string, content: string) => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (parentId && content) {
      await createReply(parentId, content, thread.address, thread.id);
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, [parentId]: "" }));
    }
  };

  if (!thread || !replies) return null;

  const filteredReplies = replies.filter(r => r.id !== thread.rootPost?.id);

  return (
    <ThreadReplies
      replies={filteredReplies}
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
