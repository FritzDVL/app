"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplyVoting } from "@/components/reply/reply-voting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";
import { postId } from "@lens-protocol/react";
import { MessageCircle, Search } from "lucide-react";

export function CommunityThreadsList({ threads }: { threads: Thread[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const loading = false;

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const query = searchQuery.toLowerCase();
    return threads.filter(t => {
      const { title, summary } = getThreadTitleAndSummary(t.rootPost);
      return (title && title.toLowerCase().includes(query)) || (summary && summary.toLowerCase().includes(query));
    });
  }, [threads, searchQuery]);

  return (
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="mb-3 flex items-center text-2xl font-bold text-foreground">
            <MessageCircle className="mr-3 h-6 w-6 text-brand-500" />
            Threads
          </h2>
        </div>
        <div className="mt-6">
          <div className="relative max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-background focus:shadow-md focus:shadow-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading threads..." />
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No threads yet</h3>
            <p className="text-muted-foreground">Be the first to start a thread in this community!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map(thread => {
              const { title, summary } = getThreadTitleAndSummary(thread.rootPost);
              return (
                <Card
                  key={thread.id}
                  className="group w-full min-w-0 cursor-pointer rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800"
                  onClick={() => {
                    router.push(`/thread/${thread.rootPost.slug}`);
                  }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col">
                      {/* MOBILE VERSION */}
                      <div className="flex w-full items-start sm:hidden">
                        <div
                          className="mr-2 flex min-w-[40px] flex-col items-center justify-start"
                          onClick={e => e.stopPropagation()}
                        >
                          {thread.rootPost && <ReplyVoting postid={postId(thread.rootPost.id)} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col">
                            <h3 className="mb-1 cursor-pointer text-base font-semibold text-foreground transition-colors group-hover:text-brand-600">
                              {title}
                            </h3>
                            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>
                            {/* Remove tags display for now */}
                          </div>
                        </div>
                      </div>
                      {/* DESKTOP VERSION */}
                      <div className="hidden sm:flex sm:items-start sm:space-x-4">
                        <div
                          className="flex min-w-[50px] flex-col items-center space-y-1"
                          onClick={e => e.stopPropagation()}
                        >
                          {thread.rootPost && <ReplyVoting postid={postId(thread.rootPost.id)} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center space-x-2">{/* Remove tags display for now */}</div>
                          <h3 className="mb-2 cursor-pointer text-lg font-semibold text-foreground transition-colors group-hover:text-brand-600">
                            {title}
                          </h3>
                          <p className="mb-3 line-clamp-2 text-muted-foreground">{summary}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              {thread.author && (
                                <Link
                                  href={`/u/${thread.author.username}`}
                                  className="flex items-center hover:text-brand-600"
                                  onClick={e => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Avatar className="mr-2 h-5 w-5">
                                    <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">{thread.author.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span>{thread.author.name}</span>
                                </Link>
                              )}
                              <span>{getTimeAgo(new Date(thread.created_at))}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <MessageCircle className="mr-1 h-4 w-4" />
                                {thread.repliesCount} replies
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Footer: author and stats for MOBILE only */}
                      <div className="mt-2 flex w-full items-center justify-between text-sm text-muted-foreground sm:hidden">
                        <div className="flex items-center space-x-4">
                          {thread.author && (
                            <Link
                              href={`/u/${thread.author.username}`}
                              className="flex items-center hover:text-brand-600"
                              onClick={e => {
                                e.stopPropagation();
                              }}
                            >
                              <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">{thread.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="max-w-[100px] truncate">{thread.author.name}</span>
                            </Link>
                          )}
                          <span>{getTimeAgo(new Date(thread.created_at))}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <MessageCircle className="mr-1 h-4 w-4" />
                            {thread.repliesCount} replies
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
