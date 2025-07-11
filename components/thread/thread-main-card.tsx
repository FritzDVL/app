import React, { useState } from "react";
import Link from "next/link";
import ContentRenderer from "@/components/shared/content-renderer";
import { TipGhoPopover } from "@/components/shared/tip-gho-popover";
import { ThreadReplyBox } from "@/components/thread/thread-reply-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThread } from "@/hooks/queries/use-thread";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Coins, Flag, Reply as ReplyIcon, Share } from "lucide-react";

export function ThreadMainCard({ threadAddress }: { threadAddress: string }) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const { createReply } = useReplyCreate();
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: thread, isLoading: loading } = useThread(threadAddress);

  const handleReply = async () => {
    if (!thread || !thread.rootPost || !thread.rootPost.id) return;
    if (replyingTo === "main" && replyContent["main"]) {
      const reply = await createReply(thread.rootPost.id, replyContent["main"], threadAddress as any, thread.id);
      if (reply) {
        setReplyingTo(null);
        setReplyContent(c => ({ ...c, main: "" }));
        queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      }
    }
  };
  const handleShare = () => {
    if (!thread) return;
    const url = `https://lens-forum.vercel.app/thread/${thread.address}`;
    const shareText = `Check out this thread on LensForum: \"${thread.title}\"\n\n`;
    window.open(`https://hey.xyz/?text=${shareText}&url=${url}`, "_blank");
  };

  if (loading) return <LoadingSpinner text="Loading thread..." />;
  if (!thread) return null;

  const postId = thread.rootPost?.id;

  return (
    <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-xl font-bold text-white">
            {thread.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
                  {thread.title}
                </h1>
                {thread.summary && (
                  <p className="mt-1 max-w-2xl text-base font-medium italic text-green-700/90">{thread.summary}</p>
                )}
              </div>
              <div className="ml-4 flex items-center gap-2 text-sm text-slate-500">
                <Link href={`/u/${thread.author.username.replace("lens/", "")}`} className="flex items-center gap-2">
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
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-300/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto sm:gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="min-w-0 flex-1 sm:flex-none">
              <Share className="mr-2 h-4 w-4" />
              <span className="truncate">Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="min-w-0 flex-1 rounded-full sm:flex-none" disabled>
              <Bookmark className="mr-2 h-4 w-4" />
              <span className="truncate">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-w-0 flex-1 rounded-full text-red-500 hover:text-red-600 sm:flex-none"
              disabled
            >
              <Flag className="mr-2 h-4 w-4" />
              <span className="truncate">Report</span>
            </Button>
            {postId && (
              <div className="min-w-0 flex-1 sm:flex-none">
                <TipGhoPopover to={postId} />
              </div>
            )}
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
  );
}
