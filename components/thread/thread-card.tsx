import React from "react";
import Link from "next/link";
import { UserHoverCard } from "@/components/shared/user-hover-card";
import { QuoteButton } from "@/components/thread/quote-button";
import { ThreadCardActions } from "@/components/thread/thread-card-actions";
import { ThreadCardInfo } from "@/components/thread/thread-card-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";

interface ThreadCardProps {
  thread: Thread;
  community: Community;
}

export function ThreadCard({ thread, community }: ThreadCardProps) {
  const isEdited = thread.rootPost?.isEdited;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [quoteText, setQuoteText] = React.useState("");

  const handleQuote = (text: string) => {
    const formattedQuote = `> ${text}\n\n`;
    setQuoteText(formattedQuote);
  };

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl py-8">
      <QuoteButton onQuote={handleQuote} containerRef={containerRef} />

      {/* Header: Author & Meta - Centered or Top Aligned */}
      <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6 dark:border-gray-800">
        <UserHoverCard profile={thread.author}>
          <Link href={`/u/${thread.author.username?.localName}`}>
            <Avatar className="h-10 w-10 cursor-pointer transition-opacity hover:opacity-80">
              <AvatarImage src={thread.author.metadata?.picture || undefined} alt={thread.author.username?.value} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white">
                {thread.author.username?.localName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </UserHoverCard>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <UserHoverCard profile={thread.author}>
              <Link
                href={`/u/${thread.author.username?.localName}`}
                className="text-sm font-semibold text-slate-900 hover:underline dark:text-gray-100"
              >
                {thread.author.username?.localName}
              </Link>
            </UserHoverCard>
            {isEdited && (
              <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                edited
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 dark:text-gray-400">
            Posted {getTimeAgo(new Date(thread.rootPost.timestamp))}
          </span>
        </div>
      </div>

      {/* Body: Title & Content */}
      <div className="min-w-0 flex-1">
        <ThreadCardInfo thread={thread} />

        {/* Footer: Actions */}
        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-gray-800">
          <ThreadCardActions
            thread={thread}
            community={community}
            initialReplyContent={quoteText}
            onReplyContentUsed={() => setQuoteText("")}
          />
        </div>
      </div>
    </div>
  );
}
