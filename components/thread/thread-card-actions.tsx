"use client";

import React from "react";
import { TipGhoPopover } from "@/components/shared/tip-gho-popover";
import { ThreadVoting } from "@/components/thread/thread-voting";
import { Button } from "@/components/ui/button";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { postId } from "@lens-protocol/react";
import { Coins, Share } from "lucide-react";

interface ThreadCardActionsProps {
  thread: Thread;
}

export function ThreadCardActions({ thread }: ThreadCardActionsProps) {
  const threadPostId = thread.rootPost?.id;

  // Default share logic if not provided
  const handleShare = () => {
    if (!thread) return;

    const { title } = getThreadTitleAndSummary(thread.rootPost, thread.feed);
    const url = `https://lensforum.xyz/thread/${thread.feed.address}`;

    const shareText = `Check out this thread on LensForum: "${title}"\n\n`;
    window.open(`https://hey.xyz/?text=${shareText}&url=${url}`, "_blank");
  };

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-muted-foreground">
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
  );
}
