"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ReplyVoting } from "../reply/reply-voting";
import { ThreadReplyBox } from "./thread-reply-box";
import { ThreadReplyModeratorActions } from "./thread-reply-moderator-actions";
import { ContentRenderer } from "@/components/shared/content-renderer";
import { UserHoverCard } from "@/components/shared/user-hover-card";
import { QuoteButton } from "@/components/thread/quote-button";
import { ThreadReplyActions } from "@/components/thread/thread-reply-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { Community } from "@/lib/domain/communities/types";
import { getReplyContent } from "@/lib/domain/replies/content";
import { Reply } from "@/lib/domain/replies/types";
import { Thread } from "@/lib/domain/threads/types";
import { getRepliesByParentId } from "@/lib/services/reply/get-replies-by-parent-id";
import { getTimeAgo } from "@/lib/shared/utils";
import { postId, useSessionClient } from "@lens-protocol/react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ThreadReplyCardProps {
  reply: Reply;
  thread: Thread;
  community?: Community;
}

export function ThreadReplyCard({ reply, thread, community }: ThreadReplyCardProps) {
  const { content, image, video } = getReplyContent(reply.post);
  const threadAddress = thread.rootPost.feed.address;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesError, setRepliesError] = useState<string | null>(null);
  const [localReplyCount, setLocalReplyCount] = useState(reply.post.stats.comments);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalReplyCount(reply.post.stats.comments);
  }, [reply.post.stats.comments]);

  const { createReply } = useReplyCreate();
  const sessionClient = useSessionClient();

  const handleQuote = (text: string) => {
    const formattedQuote = `> ${text}\n\n`;
    setReplyContent(prev => prev + formattedQuote);
    setShowReplyBox(true);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await createReply(reply.id, replyContent, threadAddress, thread.id);
      setReplyContent("");
      setShowReplyBox(false);
      setLocalReplyCount(c => c + 1);
      setShowPlusOne(true);
    } finally {
    }
  };

  const handleLoadReplies = async () => {
    if (loadingReplies) return;

    setLoadingReplies(true);
    setRepliesError(null);
    try {
      const result = await getRepliesByParentId(reply.post.id, sessionClient.data ?? undefined);
      if (result.success) {
        setReplies(result.replies ?? []);
      } else {
        setRepliesError(result.error || "Failed to load replies.");
      }
      setShowReplies(true);
    } catch (error) {
      setRepliesError("Failed to load replies.");
      console.error("Failed to load replies:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (showPlusOne) {
      const timeout = setTimeout(() => setShowPlusOne(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [showPlusOne]);

  const canReply = reply.post.operations?.canComment.__typename === "PostOperationValidationPassed";
  const canTip = reply.post.operations?.canTip;

  return (
    <div
      ref={containerRef}
      className="group relative py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-gray-800/30"
      id={reply.id}
    >
      <QuoteButton onQuote={handleQuote} containerRef={containerRef} />
      <div className="flex gap-3 sm:gap-4">
        {/* Left: Avatar */}
        <div className="flex-shrink-0 pt-1">
          <UserHoverCard profile={reply.post.author}>
            <Link href={`/u/${reply.post.author.username?.value}`}>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={reply.post.author.metadata?.picture} />
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                  {reply.post.author.metadata?.name?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>

        {/* Right: Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-1 flex items-center gap-2">
            <UserHoverCard profile={reply.post.author}>
              <Link
                href={`/u/${reply.post.author.username?.value}`}
                className="text-sm font-bold text-slate-900 hover:underline dark:text-gray-100"
              >
                {reply.post.author.metadata?.name || reply.post.author.username?.localName}
              </Link>
            </UserHoverCard>
            <span className="text-xs text-slate-500 dark:text-gray-400">
              {getTimeAgo(new Date(reply.post.timestamp))}
            </span>
            {community && <ThreadReplyModeratorActions reply={reply} community={community} />}
          </div>

          {/* Content */}
          <div className="text-sm text-slate-800 dark:text-gray-200">
            <ContentRenderer content={{ content, image, video }} className="rich-text-content mb-2" />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-4">
            <ReplyVoting postid={postId(reply.id)} />

            <div className="flex items-center gap-2">
              <div className="relative">
                <AnimatePresence>
                  {showPlusOne && (
                    <motion.span
                      initial={{ opacity: 0, y: -16, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1.1 }}
                      exit={{ opacity: 0, y: 24, scale: 0.8 }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                      className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-green-500"
                      style={{ zIndex: 10 }}
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
                {localReplyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadReplies}
                    disabled={loadingReplies}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <MessageCircle className="mr-1 h-3 w-3" />
                    {loadingReplies
                      ? "Loading..."
                      : `${localReplyCount} ${localReplyCount === 1 ? "reply" : "replies"}`}
                  </Button>
                )}
              </div>

              <ThreadReplyActions
                replyId={reply.id}
                setReplyingTo={() => setShowReplyBox(true)}
                canReply={canReply}
                canTip={!!canTip}
              />
            </div>
          </div>

          {/* Reply Editor */}
          {showReplyBox && (
            <div className="mt-4">
              <ThreadReplyBox
                value={replyContent}
                onCancel={() => {
                  setShowReplyBox(false);
                  setReplyContent("");
                }}
                onSubmit={handleReply}
                onChange={setReplyContent}
              />
            </div>
          )}

          {/* Nested Replies */}
          {showReplies && (
            <div className="mt-4 border-l-2 border-slate-100 pl-4 dark:border-gray-800">
              {repliesError && <div className="text-xs text-red-500">{repliesError}</div>}
              {replies.length === 0 && !repliesError && (
                <div className="text-xs text-muted-foreground">No replies yet.</div>
              )}
              {replies.map(nestedReply => (
                <ThreadReplyCard key={nestedReply.id} reply={nestedReply} thread={thread} community={community} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
