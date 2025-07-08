import { useState } from "react";
import Link from "next/link";
import { VotingActions } from "@/components/shared/voting-actions";
import { ThreadNewButton } from "@/components/thread/thread-new-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useCommunityThreads } from "@/hooks/queries/use-community-threads";
import { Address } from "@/types/common";
import { postId } from "@lens-protocol/react";
import { ArrowUp, Clock, Filter, Flame, MessageCircle, Search } from "lucide-react";

export function CommunityThreads({ communityAddress }: { communityAddress: string }) {
  const [sortBy, setSortBy] = useState("hot");

  const { data: threads = [], isLoading: areThreadsLoading } = useCommunityThreads(communityAddress);
  const { isMember: isJoined } = useCommunityMembership(communityAddress);

  return (
    <>
      {/* Post Thread Form */}
      {isJoined && (
        <Card className="mb-8 rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Start a Discussion</h3>
              <ThreadNewButton communityAddress={communityAddress as Address} isJoined={isJoined} />
            </div>
          </CardHeader>
        </Card>
      )}
      {/* Threads Content */}
      <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="flex items-center text-2xl font-bold text-slate-900">
              <MessageCircle className="mr-3 h-6 w-6 text-brand-500" />
              Discussions
            </h2>
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
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              <Input
                placeholder="Search threads..."
                className="rounded-full border-slate-300/60 bg-white pl-10 backdrop-blur-sm transition-all duration-300 focus:border-brand-400 focus:bg-white"
              />
            </div>
            <Button variant="ghost" size="sm" className="rounded-full transition-all duration-300 hover:scale-105">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Threads List */}
          {areThreadsLoading ? (
            <LoadingSpinner text="Loading threads..." />
          ) : threads.length === 0 ? (
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
                  className="rounded-2xl border border-slate-300/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/60"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Voting */}
                      <div className="flex min-w-[50px] flex-col items-center space-y-1">
                        {thread.rootPost && (
                          <VotingActions
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
                        <Link href={`/thread/${thread.address}`}>
                          <h3 className="mb-2 cursor-pointer text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                            {thread.title}
                          </h3>
                        </Link>
                        <p className="mb-3 line-clamp-2 text-slate-600">{thread.summary}</p>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-4">
                            {thread.author && (
                              <Link
                                href={`/u/${thread.author.username}`}
                                className="flex items-center hover:text-brand-600"
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
