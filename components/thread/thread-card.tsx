import React from "react";
import { ThreadCardActions } from "@/components/thread/thread-card-actions";
import { ThreadCardInfo } from "@/components/thread/thread-info";
import { ThreadCardReplyBox } from "@/components/thread/thread-main-reply-box";
import { Card, CardContent } from "@/components/ui/card";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  if (!thread) return null;
  return (
    <>
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6">
          <ThreadCardInfo thread={thread} />
          <ThreadCardActions thread={thread} />
          <ThreadCardReplyBox thread={thread} />
        </CardContent>
      </Card>
    </>
  );
}
