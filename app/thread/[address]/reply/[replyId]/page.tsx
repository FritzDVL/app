"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/pages/protected-route";
import ContentRenderer from "@/components/shared/content-renderer";
import { ThreadReplyCard } from "@/components/thread/thread-reply-card";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useReply } from "@/hooks/queries/use-reply";
import { useThread } from "@/hooks/queries/use-thread";
import { useReplyCreate } from "@/hooks/replies/use-reply-create";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Address } from "@/types/common";
import { useQueryClient } from "@tanstack/react-query";

function getThreadContent(thread: any): string {
  const metadata = thread?.rootPost?.metadata;
  if (metadata && typeof metadata === "object" && "content" in metadata) {
    return metadata.content ?? "";
  }
  return "";
}

export default function ReplyPage() {
  const params = useParams();
  const { address: threadAddress, replyId } = params;
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const { createReply } = useReplyCreate();
  const queryClient = useQueryClient();

  // Fetch reply and thread data
  const { data: reply, isLoading: replyLoading, error: replyError } = useReply(replyId as string);
  const { data: thread, isLoading: threadLoading } = useThread(threadAddress as Address);

  const handleReply = async (parentId: string, content: string) => {
    if (!thread || !content.trim()) return;

    const newReply = await createReply(parentId, content, threadAddress as any, thread.id);
    if (newReply) {
      setReplyingTo(null);
      setReplyContent(c => ({ ...c, [parentId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["replies", threadAddress] });
      queryClient.invalidateQueries({ queryKey: ["reply", replyId] });
    }
  };

  if (replyLoading || threadLoading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          <LoadingSpinner text="Loading reply..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (replyError || !reply) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          <div className="mb-2">
            <BackNavigationLink href={`/thread/${threadAddress}`}>Back to Thread</BackNavigationLink>
          </div>
          <Card className="rounded-lg bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <h1 className="mb-2 text-xl font-semibold text-foreground">Reply Not Found</h1>
              <p className="text-muted-foreground">
                The reply you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (!thread) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          <div className="mb-2">
            <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
          </div>
          <Card className="rounded-lg bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <h1 className="mb-2 text-xl font-semibold text-foreground">Thread Not Found</h1>
              <p className="text-muted-foreground">The thread containing this reply could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <BackNavigationLink href={`/thread/${threadAddress}`}>Back to Thread</BackNavigationLink>

        {/* Thread Context */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Thread Context</h2>
            <div className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
              <span className="text-xs text-muted-foreground">Original Thread</span>
            </div>
          </div>
          {/* Simplified Thread Context Card */}
          <div className="opacity-75 transition-opacity hover:opacity-100">
            <Card className="rounded-lg bg-gray-50/50 shadow-sm dark:border-gray-700/40 dark:bg-gray-800/50">
              <CardContent className="p-4">
                {thread && (
                  <div className="space-y-3">
                    {/* Thread Title */}
                    <div>
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                        {thread.title || "Untitled Thread"}
                      </h3>
                    </div>

                    {/* Thread Content Preview - Truncated */}
                    {getThreadContent(thread) && (
                      <div className="line-clamp-3 text-sm text-muted-foreground">
                        <ContentRenderer
                          content={stripThreadArticleFormatting(getThreadContent(thread)).slice(0, 200) + "..."}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {/* Thread Stats - Pretty formatted */}
                    <div className="flex items-center gap-3 border-t border-gray-200 pt-3 text-xs text-muted-foreground dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">{thread.repliesCount || 0}</span>
                        <span>replies</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>by</span>
                        <span className="font-medium">{thread.author?.name || "Unknown"}</span>
                      </div>
                      {thread.created_at && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Reply */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Reply</h2>

          {/* Reply with enhanced border and shadow */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-200 to-brand-300 opacity-20 blur-sm dark:from-brand-600 dark:to-brand-700"></div>
            <div className="relative rounded-lg border-2 border-brand-200 bg-white shadow-lg dark:border-brand-600 dark:bg-gray-800">
              <ThreadReplyCard
                reply={reply}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyingTo={setReplyingTo}
                setReplyContent={setReplyContent}
                handleReply={handleReply}
                rootPostId={thread.rootPost?.id || ""}
                threadAddress={threadAddress as string}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
