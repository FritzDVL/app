"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ThreadReplyBox } from "@/components/thread-reply-box";
import { ThreadReplyCard } from "@/components/thread-reply-card";
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
import { useReplyCreate } from "@/hooks/use-reply-create";
import { fetchReplies, fetchRepliesPaginated } from "@/lib/fetchers/replies";
import { fetchThread } from "@/lib/fetchers/thread";
import { type Address, PaginatedRepliesResult, type ThreadReplyWithDepth } from "@/types/common";
import { PageSize } from "@lens-protocol/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Flag, Reply as ReplyIcon, Share } from "lucide-react";

export default function ThreadPage() {
  const params = useParams();
  const { address: threadAddress } = params;

  // State handling
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  // PAGINATION STATE
  const [cursor, setCursor] = useState<string | null>(null);

  // Fetch thread with TanStack Query
  const { data: thread, isLoading: loading } = useQuery({
    queryKey: ["thread", threadAddress],
    queryFn: () => fetchThread(String(threadAddress)),
    enabled: !!threadAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Pagination handlers for replies
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

  // Fetch replies with TanStack Query (only after thread is loaded)
  const { data: replies = { replies: [], pageInfo: {} }, isLoading: loadingReplies } = useQuery<
    PaginatedRepliesResult,
    Error,
    { replies: ThreadReplyWithDepth[]; pageInfo: any }
  >({
    queryKey: ["replies", threadAddress, cursor],
    queryFn: () => fetchRepliesPaginated(String(threadAddress), PageSize.Ten, cursor),
    enabled: !!thread,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    select: (flatReplies: PaginatedRepliesResult) => {
      if (!thread?.rootPost?.id) {
        console.log("No root post found, returning empty replies");
        return { replies: [], pageInfo: flatReplies.pageInfo };
      }
      const rootPostId = String(thread.rootPost.id);

      // Filter out the root post if present
      const repliesOnly = flatReplies.items.filter(r => r.id !== rootPostId);

      // Sort by score (desc), then by createdAt (asc)
      repliesOnly.sort((a, b) => {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        if (scoreA !== scoreB) return scoreB - scoreA;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });

      const repliesByParent: { [parentId: string]: ThreadReplyWithDepth[] } = {};
      for (const reply of repliesOnly) {
        const parentId = String(reply.parentReplyId || rootPostId);
        if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
        repliesByParent[parentId].push(reply);
      }

      // Recursively flatten replies in nested order, tracking depth
      function flattenReplies(parentId: string, depth = 0): ThreadReplyWithDepth[] {
        return (repliesByParent[parentId] || []).reduce((acc, reply) => {
          acc.push({ ...reply, _depth: depth });
          acc.push(...flattenReplies(String(reply.id), depth + 1));
          return acc;
        }, [] as ThreadReplyWithDepth[]);
      }
      return {
        replies: flattenReplies(rootPostId),
        pageInfo: flatReplies.pageInfo,
      };
    },
  });
  const queryClient = useQueryClient();

  const handleReply = async () => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) {
      throw new Error("Thread or root post not found");
    }
    if (replyingTo === "main" && replyContent["main"]) {
      const reply = await createReply(thread?.rootPost?.id, replyContent["main"], threadAddress as Address);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, main: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      }
    } else if (replyingTo && replyContent[replyingTo]) {
      const reply = await createReply(replyingTo, replyContent[replyingTo], threadAddress as Address);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, [replyingTo]: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      }
    }
  };

  const { createReply } = useReplyCreate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Back to Community Link */}
        <div className="mb-2">
          <BackNavigationLink href={`/communities/${thread?.community || ""}`}>Back to Community</BackNavigationLink>
        </div>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Thread</span>
        </div>

        {/* Loading/Error State */}
        {loading && <LoadingSpinner text="Loading thread..." />}

        {/* Main Thread */}
        {thread && typeof replies !== "undefined" && (
          <Card className="rounded-xl border border-border bg-card shadow-md transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Thread Icon/Letter */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-xl font-bold text-white shadow-lg">
                  {thread.title.charAt(0).toUpperCase()}
                </div>
                {/* Main Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-brand-600">
                        {thread.title}
                      </h1>
                      {thread.summary && (
                        <p className="mt-1 max-w-2xl text-base font-medium italic text-brand-700/90">
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
                          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
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
                          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-400"></span>
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
                        <div className="prose prose-lg max-w-none whitespace-pre-line rounded-xl p-5 text-gray-800">
                          {thread.rootPost.metadata.content}
                        </div>
                      </div>
                    )}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {Array.isArray(thread.tags) &&
                      thread.tags.length > 0 &&
                      thread.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-brand-200/50 pt-4">
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1">
                    <ReplyIcon className="h-4 w-4" />
                    <span className="text-sm">{thread.repliesCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-full" disabled>
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
                </div>
              </div>
              {/* Main thread reply button and contextual reply box */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-600 hover:text-brand-700"
                  onClick={() => setReplyingTo("main")}
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
                  />
                ))}
            </div>
            <Pagination className="my-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrev}
                    // aria-disabled={!replies.pageInfo.prev}
                    // tabIndex={!pageInfo.prev ? -1 : 0}
                    // className={!pageInfo.prev ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    // aria-disabled={!pageInfo.next}
                    // tabIndex={!pageInfo.next ? -1 : 0}
                    // className={!pageInfo.next ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
