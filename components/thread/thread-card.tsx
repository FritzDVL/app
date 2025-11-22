import React from "react";
import Link from "next/link";
import { ThreadCardActions } from "@/components/thread/thread-card-actions";
import { ThreadCardInfo } from "@/components/thread/thread-card-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Clock } from "lucide-react";

interface ThreadCardProps {
  thread: Thread;
  community: Community;
}

export function ThreadCard({ thread, community }: ThreadCardProps) {
  const isEdited = thread.rootPost?.isEdited;

  return (
    <div className="flex gap-4 py-6 border-b border-slate-200 dark:border-gray-800">
      {/* Left Column: Avatar */}
      <div className="flex-shrink-0">
        <Link href={`/u/${thread.author.username?.localName}`}>
          <Avatar className="h-12 w-12 cursor-pointer transition-opacity hover:opacity-80">
            <AvatarImage src={thread.author.metadata?.picture || undefined} alt={thread.author.username?.value} />
            <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold">
              {thread.author.username?.localName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Username + Timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/u/${thread.author.username?.localName}`}
            className="text-sm font-bold text-slate-900 hover:underline dark:text-gray-100"
          >
            {thread.author.username?.localName}
          </Link>
          <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeAgo(new Date(thread.rootPost.timestamp))}
          </span>
          {isEdited && (
            <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded dark:bg-yellow-900/30 dark:text-yellow-400">
              edited
            </span>
          )}
        </div>

        {/* Body: Info (Title/Content) */}
        <ThreadCardInfo thread={thread} />

        {/* Footer: Actions */}
        <ThreadCardActions thread={thread} community={community} />
      </div>
    </div>
  );
}
