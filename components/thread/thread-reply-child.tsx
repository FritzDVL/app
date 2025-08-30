import { useState } from "react";
import { ThreadReplyCard } from "./thread-reply-card";
import { Reply as ReplyType } from "@/lib/domain/replies/types";
import { getRepliesByParentId } from "@/lib/services/reply/get-replies-by-parent-id";
import { postId } from "@lens-protocol/react";
import { Coins, MessageSquare } from "lucide-react";

interface ThreadReplyChildProps {
  reply: ReplyType;
  replyingTo?: string | null;
  replyContent?: { [key: string]: string };
  setReplyingTo?: (id: string | null) => void;
  setReplyContent?: (fn: (c: any) => any) => void;
  handleReply?: (parentId: string, content: string) => Promise<void>;
  rootPostId: string;
  threadAddress: string;
}

export function ThreadReplyChild({
  reply,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply,
  rootPostId,
  threadAddress,
}: ThreadReplyChildProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [childReplies, setChildReplies] = useState<ReplyType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleShowReplies = async () => {
    if (!showReplies) {
      setLoadingReplies(true);
      try {
        const result = await getRepliesByParentId(postId(reply.id));
        if (result.success) {
          setChildReplies(result.replies || []);
        }
        setShowReplies(true);
      } finally {
        setLoadingReplies(false);
      }
    } else {
      setShowReplies(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          className={
            `flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all duration-200 ` +
            (showReplies
              ? "border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
              : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700")
          }
          onClick={handleShowReplies}
          disabled={loadingReplies}
          title={showReplies ? "Hide replies" : "Show replies"}
        >
          <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{loadingReplies ? "..." : reply.post.stats.comments || "0"}</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
          <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{(reply as any).tips ?? 0}</span>
        </div>
      </div>
      {showReplies && childReplies.length > 0 && (
        <div className="mt-3 space-y-2 border-l-2 border-brand-100 pl-2 sm:mt-4 sm:space-y-3 sm:pl-4">
          {childReplies.map(child => (
            <ThreadReplyCard
              key={child.id}
              reply={child}
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
      )}
    </>
  );
}
