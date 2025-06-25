import { ThreadReplyCard } from "@/components/thread-reply-card";
import { Reply } from "@/types/common";

interface ThreadRepliesProps {
  replies: Reply[];
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
  handleReply: (parentId: string, content: string) => Promise<void>; // <-- add prop
}

export function ThreadReplies({
  replies,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply,
}: ThreadRepliesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{replies.length} Replies</h3>
      {replies.map((reply: Reply) => (
        <ThreadReplyCard
          key={reply.id}
          reply={reply}
          replyingTo={replyingTo}
          replyContent={replyContent}
          setReplyingTo={setReplyingTo}
          setReplyContent={setReplyContent}
          handleReply={handleReply} // pass down
        >
          {/* Nested Replies (temporarily disabled) */}
        </ThreadReplyCard>
      ))}
    </div>
  );
}
