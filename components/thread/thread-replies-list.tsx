"use client";

import React, { useEffect, useState } from "react";
import { ThreadReplies } from "@/components/thread/thread-replies";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";

interface ThreadRepliesListProps {
  thread: Thread;
}

export function ThreadRepliesList({ thread }: ThreadRepliesListProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const { createReply } = useReplyCreate();

  useEffect(() => {
    const fetchReplies = async () => {
      const repliesResponse = await getThreadReplies(thread);
      if (!repliesResponse.success) {
        setReplies([]);
        return;
      }
      const replies = repliesResponse.data?.replies ?? [];
      setReplies(replies);
    };
    fetchReplies();
  }, [thread]);

  const handleReply = async (parentId: string, content: string) => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (parentId && content) {
      await createReply(parentId, content, thread.address, thread.id);
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, [parentId]: "" }));
    }
  };

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
