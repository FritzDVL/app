import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { Reply } from "@/types/common";

interface ThreadRepliesProps {
  replies: Reply[];
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
  handleReply: (parentId: string, content: string) => Promise<void>;
  rootPostId: string;
  threadAddress: string;
}

export function ThreadReplies({
  replies,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply,
  rootPostId,
  threadAddress,
}: ThreadRepliesProps) {
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
          rootPostId={rootPostId}
          threadAddress={threadAddress}
        />
      ))}
    </div>
  );
}
