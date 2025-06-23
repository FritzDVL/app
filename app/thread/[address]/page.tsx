"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ThreadNestedReplyCard } from "@/components/thread-nested-reply-card";
import { ThreadReplyBox } from "@/components/thread-reply-box";
import { ThreadReplyCard } from "@/components/thread-reply-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThread } from "@/hooks/use-thread";
import type { Address } from "@/types/common";
import { ArrowDown, ArrowUp, Bookmark, Flag, Reply, Share } from "lucide-react";

export default function ThreadPage() {
  const params = useParams();
  const threadAddress = params.address as string;
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  // const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  // Fetch thread data using custom hook (cast threadId to Address)
  const { thread, loading, error } = useThread(threadAddress as Address);

  const replies = [
    {
      id: "1",
      content:
        threadAddress === "building-social-platform"
          ? "This looks amazing! I've been waiting for something like this. The technical stack looks solid. Have you considered implementing a reputation system to combat spam and low-quality content?"
          : "Great writeup! I've seen so many projects get rekt by reentrancy attacks. The checks-effects-interactions pattern should be taught in every Solidity course.",
      author: {
        name: "Web3 Enthusiast",
        username: "web3enthusiast.lens",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      upvotes: 15,
      downvotes: 0,
      timeAgo: "1h ago",
      replies: [
        {
          id: "11",
          content:
            threadAddress === "building-social-platform"
              ? "Great point about reputation systems! We're actually working on a token-based reputation system where users earn reputation tokens through quality contributions."
              : "Exactly! I'm working on a course about smart contract security. Would love to include some of these examples if you're okay with it.",
          author: {
            name: thread?.author?.name || "Unknown",
            username: thread?.author?.username || "unknown.lens",
            avatar: thread?.author?.avatar || "/placeholder.svg",
          },
          upvotes: 8,
          downvotes: 0,
          timeAgo: "45m ago",
        },
      ],
    },
    {
      id: "2",
      content:
        threadAddress === "building-social-platform"
          ? "Love the privacy-first approach! How are you handling the balance between decentralization and user experience? Many Web3 apps struggle with onboarding."
          : "The oracle manipulation point is crucial. I've seen DeFi protocols lose millions because they relied on a single price feed. Chainlink's decentralized oracles are a must.",
      author: {
        name: "UX Designer",
        username: "uxdesigner.lens",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      upvotes: 12,
      downvotes: 1,
      timeAgo: "1h ago",
      replies: [],
    },
  ];

  // const handleVote = (type: "up" | "down") => {
  //   setUserVote(userVote === type ? null : type);
  // };

  // const handleReaction = (reaction: string) => {
  //   setSelectedReaction(selectedReaction === reaction ? null : reaction);
  // };

  // const handleReply = (replyId?: string) => {
  //   if (replyId) {
  //     setReplyingTo(replyId);
  //     setReplyContent(c => ({ ...c, [replyId]: "" }));
  //   } else if (replyingTo) {
  //     // Submit reply to a reply or main thread
  //     // Here you would add the reply to the correct place in real app
  //     console.log("Submitting reply to:", replyingTo, replyContent);
  //     setReplyingTo(null);
  //     setReplyContent(c => ({ ...c, [replyingTo]: "" }));
  //   } else {
  //     // Open reply box for main thread
  //     setReplyingTo("main");
  //     setReplyContent(c => ({ ...c, main: "" }));
  //   }
  // };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Back to Community Link */}
        <div className="mb-2">
          <BackNavigationLink href={`/communities/${thread?.communityAddress || ""}`}>
            Back to Community
          </BackNavigationLink>
        </div>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Thread</span>
        </div>

        {/* Loading/Error State */}
        {loading && <LoadingSpinner text="Loading thread..." />}
        {error && <div className="py-8 text-center text-red-500">{error}</div>}

        {/* Main Thread */}
        {thread && (
          <Card className="gradient-card overflow-hidden border border-brand-200/50">
            <CardContent className="p-0">
              {/* Thread Header */}
              <div className="border-b border-brand-200/50 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full p-2 transition-colors ${
                        userVote === "up" ? "bg-green-100 text-green-600" : "hover:bg-green-100 hover:text-green-600"
                      }`}
                      onClick={() => setUserVote(userVote === "up" ? null : "up")}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-bold text-gray-700">
                      {thread.upvotes - thread.downvotes + (userVote === "up" ? 1 : userVote === "down" ? -1 : 0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full p-2 transition-colors ${
                        userVote === "down" ? "bg-red-100 text-red-600" : "hover:bg-red-100 hover:text-red-600"
                      }`}
                      onClick={() => setUserVote(userVote === "down" ? null : "down")}
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {thread.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{thread.title}</h1>

                    <div className="mb-4 flex items-center space-x-4">
                      <Link
                        href={`/u/${thread.author.username}`}
                        className="flex items-center space-x-2 hover:text-brand-600"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                            {thread.author.name}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium text-gray-900">{thread.author.name}</span>
                        </div>
                      </Link>
                      <span className="text-sm text-gray-500">{thread.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thread Content */}
              <div className="p-6">
                <div className="prose prose-lg mb-6 max-w-none text-gray-700">
                  <p>{thread.content}</p>
                </div>

                {/* Reactions and Actions */}
                <div className="flex items-center justify-between border-t border-brand-200/50 pt-4">
                  <div className="flex items-center space-x-4">{/* No reactions in simplified mock data */}</div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-red-500 hover:text-red-600">
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
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  {replyingTo === "main" && (
                    <ThreadReplyBox
                      value={replyContent["main"] || ""}
                      onChange={e => setReplyContent(c => ({ ...c, main: e.target.value }))}
                      onCancel={() => {
                        setReplyingTo(null);
                        setReplyContent(c => ({ ...c, main: "" }));
                      }}
                      onSubmit={() => {
                        setReplyingTo(null);
                        setReplyContent(c => ({ ...c, main: "" }));
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">{replies.length} Replies</h3>

          {replies.map(reply => (
            <ThreadReplyCard
              key={reply.id}
              reply={reply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyingTo={setReplyingTo}
              setReplyContent={setReplyContent}
            >
              {/* Nested Replies */}
              {reply.replies && reply.replies.length > 0 && (
                <div className="ml-12 space-y-4">
                  {reply.replies.map(nestedReply => (
                    <ThreadNestedReplyCard
                      key={nestedReply.id}
                      nestedReply={nestedReply}
                      replyingTo={replyingTo}
                      replyContent={replyContent}
                      setReplyingTo={setReplyingTo}
                      setReplyContent={setReplyContent}
                    />
                  ))}
                </div>
              )}
            </ThreadReplyCard>
          ))}
        </div>
      </div>
    </div>
  );
}
