import Link from "next/link";
import { ThreadVotesDisplay } from "@/components/home/thread-votes-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { Clock, Edit3, MessageCircle } from "lucide-react";

interface LatestThreadsProps {
  threads: Thread[];
  loadingThreads: boolean;
  error: any;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function ThreadsList({ threads, loadingThreads, error, activeCategory, setActiveCategory }: LatestThreadsProps) {
  return (
    <div className="mb-8 w-full max-w-none overflow-hidden rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800 md:max-w-none">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-800 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Active threads</h2>
              <div className="relative">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></div>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
              Join the discussion and share your insights
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            {["Featured", "Latest"].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "border border-brand-200/50 bg-brand-100 text-brand-700 shadow-sm dark:border-brand-700/50 dark:bg-brand-900/30 dark:text-brand-300"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-full overflow-x-auto p-4 sm:p-8">
        {loadingThreads ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-1/4 rounded-lg bg-slate-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="inline-block rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/50">
              <p className="font-medium text-red-700 dark:text-red-400">{error.message || "Failed to load threads"}</p>
            </div>
          </div>
        ) : threads.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800">
              <MessageCircle className="h-10 w-10 text-slate-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-gray-100">No threads yet</h3>
            <p className="mb-8 text-slate-500 dark:text-gray-400">Be the first to start a meaningful conversation</p>
            <Button className="rounded-full bg-brand-600 px-8 py-3 text-white hover:bg-brand-700">
              <Edit3 className="mr-2 h-4 w-4" />
              Create Thread
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-full space-y-6">
            {threads.map(thread => {
              const { title, summary } = getThreadTitleAndSummary(thread.rootPost, thread.feed);
              return (
                <div
                  key={thread.id}
                  className="group w-full min-w-0 cursor-pointer rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg sm:p-6"
                >
                  <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:gap-4">
                    <div className="w-full min-w-0 flex-1 space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <Link
                          href={`/u/${thread.author.username.replace("lens/", "")}`}
                          className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <div className="relative">
                            <Avatar className="h-8 w-8 ring-2 ring-background">
                              <AvatarImage src={thread.author.avatar || undefined} />
                              <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                                {thread.author.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="font-medium">{thread.author.username}</span>
                        </Link>
                        <span className="text-border sm:inline">•</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(new Date(thread.created_at))}
                        </span>
                      </div>
                      <div>
                        <Link href={`/thread/${thread.feed.address}`}>
                          <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                            {title}
                          </h3>
                          {summary && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>}
                        </Link>
                      </div>
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
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
