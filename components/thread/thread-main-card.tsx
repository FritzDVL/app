"use client";

import React, { useState } from "react";
import Link from "next/link";
import ContentRenderer from "@/components/shared/content-renderer";
import { TipGhoPopover } from "@/components/shared/tip-gho-popover";
import { ThreadRepliesList } from "@/components/thread/thread-replies-list";
import { ThreadReplyBox } from "@/components/thread/thread-reply-box";
import { ThreadVoting } from "@/components/thread/thread-voting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { useAuthStore } from "@/stores/auth-store";
import { postId } from "@lens-protocol/react";
import { useQueryClient } from "@tanstack/react-query";
import { Coins, Reply as ReplyIcon, Share } from "lucide-react";

function getThreadContent(thread: any): string {
  const metadata = thread?.rootPost?.metadata;
  if (metadata && typeof metadata === "object" && "content" in metadata) {
    return metadata.content ?? "";
  }
  return "";
}

interface ThreadMainCardProps {
  thread: Thread;
}

export function ThreadMainCard({ thread }: ThreadMainCardProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const { createReply } = useReplyCreate();
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const handleReply = async () => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (replyingTo === "main" && replyContent["main"]) {
      const reply = await createReply(thread.rootPost.id, replyContent["main"], thread.address, thread.id);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, main: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", thread.address] });
      }
    }
  };
  const handleShare = () => {
    if (!thread) return;
    const url = `https://lensforum.xyz/thread/${thread.address}`;
    const shareText = `Check out this thread on LensForum: \"${thread.title}\"\n\n`;
    window.open(`https://hey.xyz/?text=${shareText}&url=${url}`, "_blank");
  };

  if (!thread) return null;

  const threadPostId = thread.rootPost?.id;
  const isEdited = thread.rootPost?.isEdited;

  return (
    <>
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Header row with avatar+name on left and timestamp on right */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 text-sm font-bold">
                  <AvatarImage src={thread.author.avatar || undefined} alt={thread.author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    {thread.author.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/u/${thread.author.username.replace("lens/", "")}`}
                  className="block max-w-[8rem] truncate text-xs font-medium text-foreground"
                >
                  {thread.author.name}
                </Link>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isEdited && (
                  <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200">
                    edited
                  </span>
                )}
                {thread.rootPost?.timestamp && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    {getTimeAgo(new Date(thread.rootPost.timestamp))}
                  </span>
                )}
              </div>
            </div>

            {/* Title, summary and content in one block */}
            <div className="px-8">
              <h1 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {thread.title}
              </h1>
              {thread.summary && (
                <p className="mt-1 max-w-2xl text-base text-sm font-medium italic text-gray-500 dark:text-gray-400">
                  {thread.summary}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2">
                <ContentRenderer
                  content={stripThreadArticleFormatting(getThreadContent(thread))}
                  className="rich-text-content rounded-2xl p-0 text-foreground dark:text-gray-100"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1">
              {Array.isArray(thread.tags) && thread.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  {thread.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full border border-gray-200 bg-transparent px-2 py-0.5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <ReplyIcon className="h-4 w-4" />
                <span className="text-sm">{thread.repliesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span className="text-sm">{thread.rootPost?.stats.tips}</span>
              </div>
            </div>
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
              {threadPostId && <ThreadVoting postid={postId(threadPostId)} />}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="min-w-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <Share className="mr-2 h-4 w-4" />
                <span className="truncate">Share</span>
              </Button>
              {threadPostId && (
                <div className="min-w-0">
                  <TipGhoPopover to={threadPostId} />
                </div>
              )}
            </div>
          </div>
          {/* Main thread reply button and contextual reply box */}
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              onClick={() => setReplyingTo("main")}
              disabled={!isLoggedIn}
            >
              <ReplyIcon className="mr-2 h-4 w-4" />
              Reply
            </Button>
            {replyingTo === "main" && (
              <ThreadReplyBox
                value={replyContent["main"] || ""}
                onCancel={() => {
                  setReplyingTo(null);
                  setReplyContent(c => ({ ...c, main: "" }));
                }}
                onSubmit={handleReply}
                onChange={val => setReplyContent(c => ({ ...c, main: val }))}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <ThreadRepliesList thread={thread} />
    </>
  );
}
