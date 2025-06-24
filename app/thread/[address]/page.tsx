"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
// import { ThreadNestedReplyCard } from "@/components/thread-nested-reply-card";
import { ThreadReplyBox } from "@/components/thread-reply-box";
import { ThreadReplyCard } from "@/components/thread-reply-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useReplyCreate } from "@/hooks/use-reply-create";
import { useThreadsStore } from "@/stores/threads-store";
import { type Address, type Reply as ReplyType, Thread } from "@/types/common";
import { Bookmark, Flag, Reply as ReplyIcon, Share } from "lucide-react";

export default function ThreadPage() {
  const params = useParams();
  const { address: threadAddress } = params;

  // State handling
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  // const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);

  // Hooks
  const { fetchThreadByAddress, isLoading: loading, error } = useThreadsStore();
  const { createReply } = useReplyCreate();

  useEffect(() => {
    const fetchThread = async (threadAddress: string) => {
      const thread = await fetchThreadByAddress(threadAddress);
      setThread(thread);
    };

    if (threadAddress) {
      fetchThread(threadAddress as string);
    }
  }, [threadAddress]);

  // Handlers
  const handleReply = () => {
    if (replyingTo === "main" && replyContent["main"]?.trim()) {
      const reply = createReply(replyContent["main"]);
      if (reply) {
        setReplies(prev => [...prev, reply]);
      }
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, main: "" }));
    }
  };

  // const handleVote = (type: "up" | "down") => {
  //   setUserVote(userVote === type ? null : type);
  // };

  // const handleReaction = (reaction: string) => {
  //   setSelectedReaction(selectedReaction === reaction ? null : reaction);
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
          <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-brand-300/60 hover:shadow-md">
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
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
                          {thread.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{thread.author.name}</span>
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
                    <span className="text-sm">{replies.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                  <ReplyIcon className="mr-2 h-4 w-4" />
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
                    onSubmit={handleReply}
                  />
                )}
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
              {/* Nested Replies (temporarily disabled) */}
              {/* {false && reply.replies && reply.replies.length > 0 && (
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
              )} */}
            </ThreadReplyCard>
          ))}
        </div>
      </div>
    </div>
  );
}
