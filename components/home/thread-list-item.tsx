import Link from "next/link";
import { ThreadVotesDisplay } from "@/components/home/thread-votes-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommunity } from "@/hooks/queries/use-community";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Clock, MessageCircle } from "lucide-react";

export function ThreadListItem({ thread }: { thread: Thread }) {
  const { title, summary } = getThreadTitleAndSummary(thread.rootPost);
  const { data: communityResult } = useCommunity(thread.community);
  const community = communityResult?.community;

  return (
    <Link
      href={`/thread/${thread.rootPost.id}`}
      className="group block w-full min-w-0 cursor-pointer rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:p-6"
      tabIndex={0}
      aria-label={title}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:gap-4">
        <div className="w-full min-w-0 flex-1 space-y-4">
          {/* Top row: title + community, author at right */}
          <div className="flex w-full items-start justify-between gap-2">
            {/* Title + community */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {title}
              </h3>
              {/* Minimalist community info next to title */}
              {community && (
                <Link
                  href={`/communities/${community.group.address}`}
                  className="ml-2 inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-0.5 text-xs font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-100 hover:text-brand-800 dark:border-brand-700/40 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/60"
                  style={{ lineHeight: "1.5" }}
                  onClick={e => e.stopPropagation()}
                  tabIndex={0}
                  aria-label={community.name}
                >
                  {community.name}
                </Link>
              )}
            </div>
            {/* Author info top right */}
            <div className="ml-4 flex items-center gap-2">
              <Link
                href={`/u/${thread.author.username?.localName}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={e => e.stopPropagation()}
                tabIndex={0}
                aria-label={thread.author.username?.localName}
              >
                <Avatar className="h-6 w-6 shadow-sm">
                  <AvatarImage src={thread.author.metadata?.picture || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white">
                    {thread.author.username?.localName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden font-medium sm:inline">{thread.author.username?.localName}</span>
              </Link>
            </div>
          </div>
          {/* Summary below title/community row */}
          {summary && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>}
          {/* Metrics row and rest unchanged */}
          <div className="flex w-full max-w-full flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                <span>{thread.repliesCount || 0} replies</span>
              </div>
              <div className="flex cursor-pointer items-center gap-2 transition-colors">
                <ThreadVotesDisplay thread={thread} />
              </div>
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {getTimeAgo(new Date(thread.created_at))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
