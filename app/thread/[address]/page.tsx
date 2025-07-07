"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContentRenderer from "@/components/content-renderer";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { ThreadReplyBox } from "@/components/thread-reply-box";
import { ThreadReplyCard } from "@/components/thread-reply-card";
import { TipGhoPopover } from "@/components/tip-gho-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCommunityMembership } from "@/hooks/use-community-membership";
import { useJoinCommunity } from "@/hooks/use-join-community";
import { useReplyCreate } from "@/hooks/use-reply-create";
import { fetchCommunity } from "@/lib/fetchers/community";
import { fetchRepliesPaginated } from "@/lib/fetchers/replies";
import { fetchThread } from "@/lib/fetchers/thread";
import { useAuthStore } from "@/stores/auth-store";
import { type Address, Community, PaginatedRepliesResult, type ThreadReplyWithDepth } from "@/types/common";
import { PageSize, PostId } from "@lens-protocol/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Coins, Flag, Reply as ReplyIcon, Share } from "lucide-react";

export default function ThreadPage() {
  // 1. Hooks and state
  const params = useParams();
  const { address: threadAddress } = params;
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [cursor, setCursor] = useState<string | null>(null);
  const { createReply } = useReplyCreate();
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  // 2. Data fetching
  const { data: thread, isLoading: loading } = useQuery({
    queryKey: ["thread", threadAddress],
    queryFn: () => fetchThread(String(threadAddress)),
    enabled: !!threadAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
  const { data: community } = useQuery({
    queryKey: ["community", thread?.community],
    queryFn: () => fetchCommunity(thread?.community as Address),
    enabled: !!thread?.community,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Membership state for this thread's community
  const communityAddress = thread?.community;
  const {
    isMember: isCommunityMember,
    isLoading: isMembershipLoading,
    updateIsMember,
  } = useCommunityMembership(communityAddress || "");
  const joinCommunity = useJoinCommunity(community as Community);

  const { data: replies = { replies: [], pageInfo: {} }, isLoading: loadingReplies } = useQuery<
    PaginatedRepliesResult,
    Error,
    { replies: ThreadReplyWithDepth[]; pageInfo: any }
  >({
    queryKey: ["replies", threadAddress, cursor],
    queryFn: () => fetchRepliesPaginated(String(threadAddress), PageSize.Fifty, cursor),
    enabled: !!thread,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    select: (flatReplies: PaginatedRepliesResult) => {
      if (!thread?.rootPost?.id) {
        return { replies: [], pageInfo: flatReplies.pageInfo };
      }
      const rootPostId = String(thread.rootPost.id);
      const repliesOnly = flatReplies.items.filter(r => r.id !== rootPostId);
      repliesOnly.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
      return {
        replies: repliesOnly,
        pageInfo: flatReplies.pageInfo,
      };
    },
  });

  // 3. Handlers
  const handlePrev = () => {
    if (replies && replies.pageInfo && replies.pageInfo.prev) {
      setCursor(replies.pageInfo.prev);
    }
  };
  const handleNext = () => {
    if (replies && replies.pageInfo && replies.pageInfo.next) {
      setCursor(replies.pageInfo.next);
    }
  };
  const handleReply = async () => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) {
      throw new Error("Thread or root post not found");
    }
    if (replyingTo === "main" && replyContent["main"]) {
      const reply = await createReply(thread?.rootPost?.id, replyContent["main"], threadAddress as Address, thread.id);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, main: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      }
    } else if (replyingTo && replyContent[replyingTo]) {
      const reply = await createReply(replyingTo, replyContent[replyingTo], threadAddress as Address, thread.id);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, [replyingTo]: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      }
    }
  };
  const handleShare = () => {
    if (!thread) return;
    const url = `https://lens-forum.vercel.app/thread/${thread.address}`;
    const shareText = `Check out this thread on LensForum: "${thread.title}"\n\n`;
    window.open(`https://hey.xyz/?text=${shareText}&url=${url}`, "_blank");
  };

  // Helper: check if user is a member of the thread's community
  // const isMember = thread?.communityMembership?.isMember;

  // 4. Render
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/40">
        <Navbar />
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          {/* Back to Community Link */}
          <div className="mb-2">
            <BackNavigationLink href={`/communities/${thread?.community || ""}`}>Back to Community</BackNavigationLink>
          </div>

          {/* Join Community Banner if not a member */}
          {thread && !isMembershipLoading && !isCommunityMember && (
            <div className="mb-6 rounded-2xl border border-slate-300/60 bg-white/80 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    Join this community to participate in discussions
                  </span>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
                  onClick={async () => {
                    await joinCommunity();
                    updateIsMember(true);
                  }}
                  disabled={isMembershipLoading}
                >
                  {isMembershipLoading ? "Joining..." : "Join Community"}
                </Button>
              </div>
            </div>
          )}

          {/* Loading/Error State */}
          {loading && <LoadingSpinner text="Loading thread..." />}

          {/* Main Thread */}
          {thread && typeof replies !== "undefined" && (
            <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Thread Icon/Letter */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-xl font-bold text-white">
                    {thread.title.charAt(0).toUpperCase()}
                  </div>
                  {/* Main Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
                          {thread.title}
                        </h1>
                        {thread.summary && (
                          <p className="mt-1 max-w-2xl text-base font-medium italic text-green-700/90">
                            {thread.summary}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                          href={`/u/${thread.author.username.replace("lens/", "")}`}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-xs text-white">
                              {thread.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{thread.author.name}</span>
                        </Link>
                      </div>
                    </div>
                    {thread.rootPost &&
                      typeof thread.rootPost.metadata === "object" &&
                      "content" in thread.rootPost.metadata &&
                      thread.rootPost.metadata.content && (
                        <div className="my-6 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                            <span>
                              Posted on{" "}
                              {thread.rootPost.timestamp
                                ? new Date(thread.rootPost.timestamp).toLocaleString("en-US", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                  })
                                : "Unknown date"}
                            </span>
                          </div>
                          <ContentRenderer
                            content={thread.rootPost.metadata.content}
                            className="rich-text-content whitespace-pre-line rounded-2xl bg-slate-50/50 p-5 text-gray-800"
                          />
                        </div>
                      )}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {Array.isArray(thread.tags) &&
                        thread.tags.length > 0 &&
                        thread.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full border-slate-300/60 bg-white/80 text-xs backdrop-blur-sm"
                          >
                            #{tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-300/60 pt-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <ReplyIcon className="h-4 w-4" />
                      <span className="text-sm">{thread.repliesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      <span className="text-sm">{thread.rootPost?.stats.tips}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full" disabled>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-red-500 hover:text-red-600" disabled>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </Button>
                    {/* Tip Button */}
                    <TipGhoPopover to={thread.rootPost?.id || ("" as PostId)} />
                  </div>
                </div>
                {/* Main thread reply button and contextual reply box */}
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => setReplyingTo("main")}
                    disabled={!isLoggedIn}
                  >
                    <ReplyIcon className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  {replyingTo === "main" && (
                    <ThreadReplyBox
                      value={replyContent["main"] || ""}
                      onCancel={() => {
                        setReplyingTo(null);
                        setReplyContent(c => ({ ...c, main: "" }));
                      }}
                      onSubmit={handleReply}
                      onChange={val => setReplyContent(c => ({ ...c, main: val }))}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Replies */}
          {loadingReplies ? (
            <LoadingSpinner text="Loading replies..." />
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {Array.isArray(replies.replies) ? replies.replies.length : 0} Replies
                </h3>
                {(Array.isArray(replies.replies) ? replies.replies : [])
                  .filter((reply: any) => reply.id !== thread?.rootPost?.id)
                  .map((reply: any) => (
                    <ThreadReplyCard
                      key={reply.id}
                      reply={reply}
                      replyingTo={replyingTo}
                      replyContent={replyContent}
                      setReplyingTo={setReplyingTo}
                      setReplyContent={setReplyContent}
                      handleReply={handleReply}
                      depth={reply._depth ?? 0}
                      rootPostId={thread?.rootPost?.id || ""}
                    />
                  ))}
              </div>
              <Pagination className="my-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePrev}
                      aria-disabled={!replies.pageInfo.prev || cursor === null}
                      tabIndex={!replies.pageInfo.prev || cursor === null ? -1 : 0}
                      className={
                        !replies.pageInfo.prev || cursor === null
                          ? "pointer-events-none cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNext}
                      aria-disabled={!replies.pageInfo.next}
                      tabIndex={!replies.pageInfo.next ? -1 : 0}
                      className={
                        !replies.pageInfo.next ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export function ThreadAddressPage() {
  return <ProtectedRoute>{null}</ProtectedRoute>;
}
