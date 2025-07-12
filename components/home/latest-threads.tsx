import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Thread } from "@/types/common";
import { Clock, Edit3, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

interface LatestThreadsProps {
  threads: Thread[];
  loadingThreads: boolean;
  error: any;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  formatDate: (date: Date) => string;
}

export function LatestThreads({
  threads,
  loadingThreads,
  error,
  activeCategory,
  setActiveCategory,
  formatDate,
}: LatestThreadsProps) {
  return (
    <div className="x-auto mb-8 w-full max-w-full overflow-hidden rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Active threads</h2>
              <div className="relative">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></div>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-600">Join the discussion and share your insights</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            {["Featured", "Latest"].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "border border-brand-200/50 bg-brand-100 text-brand-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
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
                  <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 rounded-lg bg-slate-200"></div>
                    <div className="h-4 w-1/2 rounded-lg bg-slate-200"></div>
                    <div className="h-3 w-1/4 rounded-lg bg-slate-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="inline-block rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="font-medium text-red-700">{error.message || "Failed to load threads"}</p>
            </div>
          </div>
        ) : threads.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <MessageCircle className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">No threads yet</h3>
            <p className="mb-8 text-slate-500">Be the first to start a meaningful conversation</p>
            <Button className="rounded-full bg-brand-600 px-8 py-3 text-white hover:bg-brand-700">
              <Edit3 className="mr-2 h-4 w-4" />
              Create Thread
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-full space-y-6">
            {threads.map(thread => (
              <div
                key={thread.id}
                className="group w-full min-w-0 cursor-pointer rounded-2xl border border-slate-300/60 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300/60 sm:p-6"
              >
                <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:gap-4">
                  <div className="w-full min-w-0 flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Link
                        href={`/u/${thread.author.username.replace("lens/", "")}`}
                        className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                      >
                        <div className="relative">
                          <Avatar className="h-8 w-8 ring-2 ring-white">
                            <AvatarImage src={thread.author.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white">
                              {thread.author.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="font-medium">{thread.author.username}</span>
                      </Link>
                      <span className="text-slate-300 sm:inline">•</span>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(new Date(thread.created_at))}
                      </span>
                    </div>
                    <div>
                      <Link href={`/thread/${thread.address}`}>
                        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                          {thread.title}
                        </h3>
                        {thread.summary && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{thread.summary}</p>}
                      </Link>
                    </div>
                    <div className="flex w-full max-w-full flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                        <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-brand-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{thread.repliesCount || 0} replies</span>
                        </div>
                        <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{thread.upvotes || 0}</span>
                        </div>
                        <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-red-600">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{thread.downvotes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
