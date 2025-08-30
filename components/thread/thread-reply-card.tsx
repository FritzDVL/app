import Link from "next/link";
import { ReplyVoting } from "../reply/reply-voting";
import { ThreadReplyBox } from "./thread-reply-box";
import { ContentRenderer } from "@/components/shared/content-renderer";
import { ThreadReplyActions } from "@/components/thread/thread-reply-actions";
import { ThreadReplyChild } from "@/components/thread/thread-reply-child";
import { ThreadReplyInReplyTo } from "@/components/thread/thread-reply-in-reply-to";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getReplyContent } from "@/lib/domain/replies/content";
import { Reply as ReplyType } from "@/lib/domain/replies/types";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/shared/utils";
import { postId } from "@lens-protocol/react";

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
                <ThreadReplyChild
                  reply={reply}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  setReplyingTo={setReplyingTo}
                  setReplyContent={setReplyContent}
                  handleReply={handleReply}
                  rootPostId={rootPostId}
                  threadAddress={threadAddress}
                />
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
            </div>
          </div>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
