"use client";

import { useState } from "react";
import Link from "next/link";
import { ReplyVoting } from "../reply/reply-voting";
import { ThreadReplyBox } from "./thread-reply-box";
import { ThreadReplyModeratorActions } from "./thread-reply-moderator-actions";
import { ContentRenderer } from "@/components/shared/content-renderer";
import { ThreadInReplyTo } from "@/components/thread/thread-in-reply-to";
import { ThreadReplyActions } from "@/components/thread/thread-reply-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Community } from "@/lib/domain/communities/types";
import { getReplyContent } from "@/lib/domain/replies/content";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/shared/utils";
import { postId } from "@lens-protocol/react";
import { MessageCircle } from "lucide-react";

interface ThreadReplyCardProps {
  reply: Reply;
  thread: Thread;
  community?: Community;
}

export function ThreadReplyCard({ reply, thread, community }: ThreadReplyCardProps) {
  const content = getReplyContent(reply.post);
  const rootPostId = thread.rootPost?.id || "";
  const threadAddress = thread.rootPost.feed.address;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { createReply } = useReplyCreate();

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await createReply(reply.id, replyContent, threadAddress, thread.id);
      setReplyContent("");
      setShowReplyBox(false);
    } finally {
    }
  };

  const canReply = reply.post.operations?.canComment.__typename === "PostOperationValidationPassed";
  const canTip = reply.post.operations?.canTip;

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
                <div className="flex w-full items-center justify-between gap-2">
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
                  <div className="flex items-center gap-2">
                    {community && <ThreadReplyModeratorActions reply={reply} community={community} />}
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {getTimeAgo(new Date(reply.post.timestamp))}
                    </span>
                  </div>
                </div>
              </div>

              {/* In-reply-to context chain: render below the author row (above content) */}
              {reply.post.commentOn?.id && reply.post.commentOn.id !== rootPostId && (
                <div className="mb-2">
                  <ThreadInReplyTo parentId={reply.post.commentOn.id} rootPostId={rootPostId} />
                </div>
              )}

              {/* Content */}
              <ContentRenderer content={removeTrailingEmptyPTags(content)} className="rich-text-content mb-2" />
              {/* Reply button and tip button bottom */}
              <div className="mt-3 flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {reply.post.stats.comments > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{reply.post.stats.comments}</span>
                    </div>
                  )}
                </div>
                <div className="flex w-full justify-end sm:w-auto">
                  <ThreadReplyActions
                    replyId={reply.id}
                    setReplyingTo={() => setShowReplyBox(true)}
                    canReply={canReply}
                    canTip={!!canTip}
                  />
                </div>
              </div>
              {showReplyBox && (
                <ThreadReplyBox
                  value={replyContent}
                  onCancel={() => {
                    setShowReplyBox(false);
                    setReplyContent("");
                  }}
                  onSubmit={handleReply}
                  onChange={setReplyContent}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
