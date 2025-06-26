"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LeaveCommunityDialog } from "@/components/community-leave-dialog";
import { CommunityModerators } from "@/components/community-moderators";
import { CommunityRules } from "@/components/community-rules";
import { Navbar } from "@/components/navbar";
import { ThreadNewButton } from "@/components/thread-new-button";
import { ThreadVoting } from "@/components/thread-voting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityMembership } from "@/hooks/use-community-membership";
import { useJoinCommunity } from "@/hooks/use-join-community";
import { useLeaveCommunity } from "@/hooks/use-leave-community";
import { fetchCommunity } from "@/lib/fetchers/community";
import { fetchThreads } from "@/lib/fetchers/threads";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUp,
  Clock,
  Filter,
  FlameIcon as Fire,
  MessageCircle,
  MoreHorizontal,
  Search,
  Share,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function CommunityPage() {
  const params = useParams();
  const communityAddress = params.address as string;

  // --- State ---
  const [showPostForm, setShowPostForm] = useState(false);
  const [sortBy, setSortBy] = useState("hot");
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // --- Fetch community (React Query) ---
  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ["community", communityAddress],
    queryFn: () => fetchCommunity(communityAddress),
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // --- Fetch threads (React Query) ---
  const { data: threads = [], isLoading: areThreadsLoading } = useQuery({
    queryKey: ["threads", communityAddress],
    queryFn: () => fetchThreads(communityAddress),
    enabled: !!communityAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const communityThreads = threads.filter(thread => thread.community === communityAddress);
  const { isMember: isJoined, isLoading: isMembershipLoading } = useCommunityMembership(communityAddress);

  const joinCommunity = useJoinCommunity(communityAddress);
  const leaveCommunity = useLeaveCommunity(communityAddress);

  const handleVote = (threadId: string, type: "up" | "down") => {
    console.log(`Voted ${type} on thread ${threadId}`);
  };

  const handleLeaveCommunity = async () => {
    setShowLeaveDialog(true);
  };

  const confirmLeaveCommunity = async () => {
    try {
      await leaveCommunity();
      toast.success("You have left the community.");
    } catch (error) {
      toast.error("Could not leave the community", {
        description: "Please try again later.",
      });
      console.error("Error leaving community:", error);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Back to Communities Button */}
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>

      {/* Loading State */}
      {(isCommunityLoading || isMembershipLoading) && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
          <p className="text-lg font-medium text-slate-600">Loading community...</p>
          <p className="mt-2 text-sm text-slate-400">Fetching data from Lens Protocol</p>
        </div>
      )}

      {/* Main Content */}
      {community && !isCommunityLoading && (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Community Header Card */}
              <Card className="mb-8 rounded-xl border border-border bg-card shadow-md">
                <CardContent className="p-8">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-6 md:space-y-0">
                    <div className="flex h-[100px] w-[100px] items-center justify-center">
                      {community.logo ? (
                        <Image
                          src={community.logo.replace("lens://", "https://api.grove.storage/")}
                          alt={community.name}
                          width={100}
                          height={100}
                          className="h-[100px] w-[100px] rounded-full border border-slate-200 bg-white object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-white shadow-lg">
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="mb-2 truncate text-3xl font-bold text-slate-900">{community.name}</h1>
                      <p className="mb-4 max-w-2xl truncate text-slate-600">{community.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {community.memberCount.toLocaleString()} members
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {community.threadsCount} threads
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={isJoined ? handleLeaveCommunity : joinCommunity}
                        className={`rounded-full px-8 py-3 font-semibold transition-colors ${
                          isJoined
                            ? "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
                        }`}
                      >
                        {isJoined ? "Leave Community" : "Join Community"}
                      </Button>
                      <LeaveCommunityDialog
                        open={showLeaveDialog}
                        onOpenChange={setShowLeaveDialog}
                        onConfirm={confirmLeaveCommunity}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Post Thread Form */}
              {isJoined && (
                <Card className="mb-8 rounded-xl border border-border bg-card shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">Start a Discussion</h3>
                      <ThreadNewButton communityAddress={community.address} isJoined={isJoined} />
                    </div>
                  </CardHeader>
                  {showPostForm && (
                    <CardContent className="space-y-4 pt-0">
                      <Input
                        placeholder="Thread title..."
                        value={newPost.title}
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                        className="border-slate-200/60 focus:border-brand-400"
                      />
                      <Textarea
                        placeholder="What's on your mind? Share your thoughts, questions, or ideas..."
                        value={newPost.content}
                        onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                        className="min-h-[120px] border-slate-200/60 focus:border-brand-400"
                      />
                      <Input
                        placeholder="Tags (comma separated)"
                        value={newPost.tags}
                        onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                        className="border-slate-200/60 focus:border-brand-400"
                      />
                      <div className="flex justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setShowPostForm(false)}>
                          Cancel
                        </Button>
                        <Button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 font-semibold text-white hover:from-brand-600 hover:to-brand-700">
                          Post Thread
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Threads Content */}
              <Card className="rounded-xl border border-border bg-card shadow-md">
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
                        className="rounded-full"
                      >
                        <Fire className="mr-2 h-4 w-4" />
                        Hot
                      </Button>
                      <Button
                        variant={sortBy === "new" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy("new")}
                        className="rounded-full"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        New
                      </Button>
                      <Button
                        variant={sortBy === "top" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy("top")}
                        className="rounded-full"
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
                        className="rounded-xl border-slate-200/60 bg-white/70 pl-10 backdrop-blur-sm focus:border-brand-400"
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Threads List */}
                  {areThreadsLoading ? (
                    <LoadingSpinner text="Loading threads..." />
                  ) : isCommunityLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
                      <p className="text-slate-600">Loading threads from Lens Protocol...</p>
                    </div>
                  ) : communityThreads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 text-4xl">📝</div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">No threads yet</h3>
                      <p className="text-slate-600">Be the first to start a discussion in this community!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communityThreads.map(thread => (
                        <Card
                          key={thread.id}
                          className="rounded-xl border border-border bg-card shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              {/* Voting */}
                              <div className="flex min-w-[50px] flex-col items-center space-y-1">
                                <ThreadVoting
                                  votes={thread.upvotes - thread.downvotes}
                                  onUpvote={() => handleVote(thread.id, "up")}
                                  onDownvote={() => handleVote(thread.id, "down")}
                                />
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center space-x-2">
                                  {/* {thread.isPinned && (
                                    <Badge className="border-brand-200 bg-brand-50 text-brand-600">
                                      <Pin className="mr-1 h-3 w-3" />
                                      Pinned
                                    </Badge>
                                  )} */}
                                  {/* {thread.isHot && (
                                    <Badge className="border-orange-200 bg-orange-50 text-orange-600">🔥 Hot</Badge>
                                  )} */}
                                  {Array.isArray(thread.tags) &&
                                    thread.tags.length > 0 &&
                                    thread.tags.map((tag: string) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                </div>

                                <Link href={`/thread/${thread.id}`}>
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
                                    <Button variant="ghost" size="sm" className="p-1">
                                      <Share className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="p-1">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Rules */}
              <CommunityRules />

              {/* Moderators */}
              <CommunityModerators moderators={community.moderators} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
