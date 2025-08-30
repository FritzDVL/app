import { useState } from "react";
import Link from "next/link";
import { ReplyVoting } from "../reply/reply-voting";
import { ThreadReplyBox } from "./thread-reply-box";
import { ContentRenderer } from "@/components/shared/content-renderer";
import { ThreadReplyActions } from "@/components/thread/thread-reply-actions";
import { ThreadReplyInReplyTo } from "@/components/thread/thread-reply-in-reply-to";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getReplyContent } from "@/lib/domain/replies/content";
import { Reply as ReplyType } from "@/lib/domain/replies/types";
import { getRepliesByParentId } from "@/lib/services/reply/get-replies-by-parent-id";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/shared/utils";
import { postId } from "@lens-protocol/react";
import { Coins, MessageSquare } from "lucide-react";

export function ThreadReplyCard({
  reply,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply,
  children,
  rootPostId,
  threadAddress,
}: {
  reply: ReplyType & { _depth?: number };
  replyingTo?: string | null;
  replyContent?: { [key: string]: string };
  setReplyingTo?: (id: string | null) => void;
  setReplyContent?: (fn: (c: any) => any) => void;
  handleReply?: (parentId: string, content: string) => Promise<void>;
  children?: React.ReactNode;
  depth?: number;
  rootPostId: string;
  threadAddress: string;
}) {
  // State and logic for showing child replies
  const [showReplies, setShowReplies] = useState(false);
  const [childReplies, setChildReplies] = useState<ReplyType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Handler to show/hide child replies
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

  const content = getReplyContent(reply.post);

  return (
    <div className="space-y-2" id={reply.id}>
      <Card className="rounded-lg bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <ReplyVoting postid={postId(reply.id)} />
            </div>
            <div className="min-w-0 flex-1">
              {/* Top row: author info and show context button at top right */}
              <div className="relative mb-3 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/u/${reply.post.author.username?.value}`}
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                      <AvatarImage src={reply.post.author.metadata?.picture} />
                      <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                        {reply.post.author.metadata?.name?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{reply.post.author.metadata?.name}</span>
                  </Link>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {getTimeAgo(new Date(reply.post.timestamp))}
                  </span>
                </div>
                {/* removed ThreadReplyInReplyTo from this top row to avoid placing context next to avatar */}
              </div>

              {/* In-reply-to context chain: render below the author row (above content) */}
              {reply.post.commentOn?.id && reply.post.commentOn.id !== rootPostId && (
                <div className="mb-2">
                  <ThreadReplyInReplyTo parentId={reply.post.commentOn.id} rootPostId={rootPostId} />
                </div>
              )}

              {/* Content */}
              <ContentRenderer content={removeTrailingEmptyPTags(content)} className="rich-text-content mb-2" />
              {/* Reply button and tip button bottom */}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {/* Tips counter and replies button bottom left */}
                <div className="flex items-center gap-2">
                  {/* Button to show child replies */}
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
                <ThreadReplyActions replyId={reply.id} threadAddress={threadAddress} setReplyingTo={setReplyingTo} />
              </div>
              {replyingTo === reply.id && replyContent && setReplyingTo && setReplyContent && handleReply && (
                <ThreadReplyBox
                  value={replyContent[reply.id] || ""}
                  onCancel={() => {
                    setReplyingTo(null);
                    setReplyContent(c => ({ ...c, [reply.id]: "" }));
                  }}
                  onSubmit={async () => {
                    const raw = replyContent[reply.id] || "";
                    const withoutTrailingPTags = removeTrailingEmptyPTags(raw);
                    const trimmed = withoutTrailingPTags.replace(/(\S)(\s+)$/g, "$1");
                    if (!trimmed.trim()) return;
                    await handleReply(reply.id, trimmed);
                    setReplyContent(c => ({ ...c, [reply.id]: "" }));
                  }}
                  onChange={val => {
                    const trimmed = val.replace(/(\S)(\s+)$/g, "$1");
                    setReplyContent(c => ({ ...c, [reply.id]: trimmed }));
                  }}
                />
              )}

              {/* Recursive rendering of child replies */}
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
            </div>
          </div>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
