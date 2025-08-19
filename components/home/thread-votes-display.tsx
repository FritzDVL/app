"use client";

import { useVoting } from "@/hooks/common/use-voting";
import { Thread } from "@/lib/domain/threads/types";
import { postId as toPostId } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ThreadVotesDisplayProps {
  thread: Thread;
}

export function ThreadVotesDisplay({ thread }: ThreadVotesDisplayProps) {
  const postId = thread.rootPost?.id;
  const validPostId = postId ? toPostId(postId) : undefined;
  const { scoreState, isLoading } = useVoting({ postid: validPostId as any });
  if (!validPostId) return null;

  return (
    <div className="flex cursor-pointer items-center gap-2">
      <ArrowUp className="h-4 w-4 transition-colors hover:text-primary" />
      <span className="mx-1 min-w-[1.5rem] text-center text-sm font-semibold text-foreground">
        {isLoading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent align-middle" />
        ) : (
          scoreState
        )}
      </span>
      <ArrowDown className="h-4 w-4 transition-colors hover:text-red-600" />
    </div>
  );
}
