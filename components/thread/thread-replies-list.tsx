import React, { useState } from "react";
import { ThreadReplies } from "@/components/thread/thread-replies";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThread } from "@/hooks/queries/use-thread";
import { useThreadReplies } from "@/hooks/queries/use-thread-replies";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { useQueryClient } from "@tanstack/react-query";

export function ThreadRepliesList({ threadAddress }: { threadAddress: string }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const { createReply } = useReplyCreate();
  const { data: thread } = useThread(threadAddress);
  const { data: replies, isLoading } = useThreadReplies(threadAddress, null, thread?.rootPost?.id);
  const queryClient = useQueryClient();

  const handleReply = async (parentId: string, content: string) => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (parentId && content) {
      await createReply(parentId, content, threadAddress as any, thread.id);
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, [parentId]: "" }));
      // Invalidate thread replies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading replies..." />;
  if (!thread || !replies) return null;

  return (
    <ThreadReplies
      replies={replies.replies}
      replyingTo={replyingTo}
      replyContent={replyContent}
      setReplyingTo={setReplyingTo}
      setReplyContent={setReplyContent}
      handleReply={handleReply}
      rootPostId={thread.rootPost?.id || ""}
      threadAddress={threadAddress}
    />
  );
}
