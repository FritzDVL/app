"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplyVoting } from "@/components/reply/reply-voting";
import { ThreadNewButton } from "@/components/thread/thread-new-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Thread } from "@/lib/domain/threads/types";
import { postId } from "@lens-protocol/react";
import { MessageCircle, Search } from "lucide-react";

export function CommunityThreads({ threads, isJoined = true }: { threads: Thread[]; isJoined?: boolean }) {
  const router = useRouter();

  return (
    <>
      {/* Post Thread Form */}
      {isJoined && (
        <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Start a Discussion</h3>
              <ThreadNewButton communityAddress={threads[0].community} isJoined={isJoined} />
            </div>
          </CardHeader>
        </Card>
      )}
      {/* Threads Content */}
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="mb-3 flex items-center text-2xl font-bold text-foreground">
              <MessageCircle className="mr-3 h-6 w-6 text-brand-500" />
              Discussions
            </h2>
            {/*
            <div className="flex items-center space-x-2">
              <Button
                variant={sortBy === "hot" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("hot")}
                className="rounded-full transition-all duration-300 hover:scale-105"
              >
                <Flame className="mr-2 h-4 w-4" />
                Hot
              </Button>
              <Button
                variant={sortBy === "new" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("new")}
                className="rounded-full transition-all duration-300 hover:scale-105"
              >
                <Clock className="mr-2 h-4 w-4" />
                New
              </Button>
              <Button
                variant={sortBy === "top" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy("top")}
                className="rounded-full transition-all duration-300 hover:scale-105"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Top
              </Button>
            </div>
            */}
          </div>
          <div className="mt-6">
            <div className="relative max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-background focus:shadow-md focus:shadow-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="Search communities..."
                  // value={searchQuery}
                  // onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Threads List */}
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">No threads yet</h3>
              <p className="text-slate-600">Be the first to start a discussion in this community!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threads.map(thread => (
                <Card
                  key={thread.id}
                  className="group mb-4 w-full min-w-0 cursor-pointer rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800"
                  onClick={() => {
                    router.push(`/thread/${thread.address}`);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Voting */}
                      <div className="flex min-w-[50px] flex-col items-center space-y-1">
                        {thread.rootPost && (
                          <ReplyVoting
                            postid={postId(thread.rootPost.id)}
                            score={thread.rootPost.stats.upvotes - thread.rootPost.stats.downvotes}
                          />
                        )}
                      </div>
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          {Array.isArray(thread.tags) &&
                            thread.tags.length > 0 &&
                            thread.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                        </div>
                        <h3 className="mb-2 cursor-pointer text-lg font-semibold text-foreground transition-colors group-hover:text-brand-600">
                          {thread.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-muted-foreground">{thread.summary}</p>
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
                            <span>{thread.timeAgo}</span>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
