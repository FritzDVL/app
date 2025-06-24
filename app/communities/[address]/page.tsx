"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CommunityModerators } from "@/components/community-moderators";
import { CommunityRules } from "@/components/community-rules";
import { Navbar } from "@/components/navbar";
import { ThreadNewButton } from "@/components/thread-new-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityDetails } from "@/hooks/use-community-details";
import { useThreadsStore } from "@/stores/threads-store";
import { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Filter,
  FlameIcon as Fire,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Search,
  Share,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export default function CommunityPage() {
  const params = useParams();
  const communityAddress = params.address as string;

  const [showPostForm, setShowPostForm] = useState(false);
  const [sortBy, setSortBy] = useState("hot");
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });

  // Use custom hooks for community details
  const { communityDetails, isJoined, setIsJoined, isLoading, error } = useCommunityDetails(communityAddress);

  // Use threads store directly
  const { threads, fetchThreadsByCommunity, isLoading: isLoadingThreads } = useThreadsStore();

  // Get threads for this community
  const communityThreads = threads[communityAddress] || [];

  // Effects
  useEffect(() => {
    if (communityAddress) {
      fetchThreadsByCommunity(communityAddress);
    }
  }, [communityAddress, fetchThreadsByCommunity]);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const handleJoinCommunity = async () => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: "Please log in to join communities.",
      });
      return;
    }
    try {
      const result = await joinGroup(sessionClient.data, {
        group: evmAddress(communityAddress),
      }).andThen(handleOperationWith(walletClient.data));

      if (result.isOk()) {
        setIsJoined(true);
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      toast.error("Action Failed", {
        description: "Unable to update your membership status. Please try again.",
      });
      // Revert the state change on error
      setIsJoined(false);
    }
  };

  const handleVote = (threadId: string, type: "up" | "down") => {
    console.log(`Voted ${type} on thread ${threadId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Back to Communities Button */}
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
          <p className="text-lg font-medium text-slate-600">Loading community...</p>
          <p className="mt-2 text-sm text-slate-400">Fetching data from Lens Protocol</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mx-auto max-w-2xl px-4 py-24">
          <div className="text-center">
            <div className="mb-4 text-6xl">😞</div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Community Not Found</h1>
            <p className="mb-6 text-slate-600">{error}</p>
            <Link href="/communities">
              <Button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 font-semibold text-white hover:from-brand-600 hover:to-brand-700">
                Back to Communities
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      {communityDetails && !isLoading && !error && (
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Community Header Card */}
              <Card className="mb-8 border-0 bg-white/70 shadow-sm backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-6xl">
                        {communityDetails.logo ? (
                          <Image
                            src={communityDetails.logo.replace("lens://", "https://api.grove.storage/")}
                            alt={communityDetails.name}
                            width={100}
                            height={100}
                            className="h-16 w-16 rounded-full border border-slate-200 bg-white object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-white shadow-lg">
                            {communityDetails.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h1 className="mb-2 text-3xl font-bold text-slate-900">{communityDetails.name}</h1>
                        <p className="mb-4 max-w-2xl text-slate-600">{communityDetails.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {communityDetails.members.toLocaleString()} members
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {communityDetails.threads} threads
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={handleJoinCommunity}
                        className={`rounded-full px-8 py-3 font-semibold transition-colors ${
                          isJoined
                            ? "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
                        }`}
                      >
                        {isJoined ? "✓ Joined" : "Join Community"}
                      </Button>
                      {communityDetails.isPremium && (
                        <Button className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 font-semibold text-white hover:from-yellow-500 hover:to-orange-600">
                          Unlock Premium
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Post Thread Form */}
              {isJoined && (
                <Card className="mb-8 border-0 bg-white/70 shadow-sm backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">Start a Discussion</h3>
                      <ThreadNewButton communityId={communityDetails.id} isJoined={isJoined} />
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
              <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
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
                  {isLoadingThreads ? (
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
                      {communityThreads.map((thread: Thread) => (
                        <Card
                          key={thread.id}
                          className="border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-brand-300/60 hover:shadow-md"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              {/* Voting */}
                              <div className="flex min-w-[50px] flex-col items-center space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full p-1 transition-colors hover:bg-brand-50 hover:text-brand-600"
                                  onClick={() => handleVote(thread.id, "up")}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium text-slate-600">
                                  {thread.upvotes - thread.downvotes}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full p-1 transition-colors hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleVote(thread.id, "down")}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center space-x-2">
                                  {thread.isPinned && (
                                    <Badge className="border-brand-200 bg-brand-50 text-brand-600">
                                      <Pin className="mr-1 h-3 w-3" />
                                      Pinned
                                    </Badge>
                                  )}
                                  {thread.isHot && (
                                    <Badge className="border-orange-200 bg-orange-50 text-orange-600">🔥 Hot</Badge>
                                  )}
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
                                      {thread.replies} replies
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
              <CommunityModerators groupAddress={communityDetails.id} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
