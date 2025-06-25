import { ThreadReplyCard } from "@/components/thread-reply-card";
import { Reply } from "@/types/common";

interface ThreadRepliesProps {
  replies: Reply[];
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
  handleReply: (parentId: string, content: string) => Promise<void>;
  rootPostId: string;
}

export function ThreadReplies({
  replies,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply,
  rootPostId,
}: ThreadRepliesProps) {
  // Organize replies by parentReplyId
  const repliesByParent: { [parentId: string]: Reply[] } = {};
  for (const reply of replies) {
    const parentId = reply.parentReplyId || rootPostId;
    if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
    repliesByParent[parentId].push(reply);
  }

  // Recursive render with indentation for nesting
  function renderReplies(parentId: string, depth = 0) {
    return (repliesByParent[parentId] || []).map(reply => (
      <div key={reply.id} style={{ marginLeft: depth * 24 }}>
        <ThreadReplyCard
          reply={reply}
          replyingTo={replyingTo}
          replyContent={replyContent}
          setReplyingTo={setReplyingTo}
          setReplyContent={setReplyContent}
          handleReply={handleReply}
        >
          {renderReplies(reply.id, depth + 1)}
        </ThreadReplyCard>
      </div>
    ));
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{replies.length} Replies</h3>
      {renderReplies(rootPostId)}
    </div>
  );
}
