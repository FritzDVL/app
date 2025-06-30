import { useState } from "react";
import Link from "next/link";
import { ThreadReplyBox } from "./thread-reply-box";
import { VotingActions } from "./voting-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchReply } from "@/lib/fetchers/reply";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Reply as ReplyType } from "@/types/common";
import { postId } from "@lens-protocol/react";
import { Reply } from "lucide-react";

export function ThreadReplyCard({
  reply,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
  handleReply, // <-- add this prop
  children,
  rootPostId, // <-- new prop for root post id
}: {
  reply: ReplyType & { _depth?: number };
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
  handleReply: (parentId: string, content: string) => Promise<void>;
  children?: React.ReactNode;
  depth?: number;
  rootPostId: string; // <-- new prop
}) {
  // State for showing context
  const [showContext, setShowContext] = useState(false);
  const [contextChain, setContextChain] = useState<ReplyType[]>([]);
  const [loadingContext, setLoadingContext] = useState(false);

  const { isLoggedIn } = useAuthStore();

  // Recursively fetch context chain, stopping at rootPostId
  const fetchContextChain = async (parentId: string, acc: ReplyType[] = []): Promise<ReplyType[]> => {
    if (!parentId || parentId === rootPostId) return acc;
    const parent = await fetchReply(parentId);
    if (!parent || parent.id === rootPostId) return acc;
    acc.unshift(parent); // prepend for top-down order
    if (parent.parentReplyId && parent.parentReplyId !== rootPostId) {
      return fetchContextChain(parent.parentReplyId, acc);
    }
    return acc;
  };

  // Handler to fetch and show context chain
  const handleShowContext = async () => {
    if (!reply.parentReplyId || reply.parentReplyId === rootPostId) return;
    setLoadingContext(true);
    try {
      if (!showContext) {
        const chain = await fetchContextChain(reply.parentReplyId);
        setContextChain(chain);
        setShowContext(true);
      } else {
        setShowContext(false);
      }
    } finally {
      setLoadingContext(false);
    }
  };

  // Context chain UI
  const ContextChain = () => (
    <div className="mb-2 flex flex-col gap-2">
      {contextChain.map((ctx, idx) => (
        <div key={ctx.id} className="relative flex items-start gap-2 pl-3">
          {/* Vertical line for chain */}
          {idx < contextChain.length - 1 && (
            <span className="absolute left-0 top-5 h-full w-px bg-brand-100" style={{ minHeight: 32 }} />
          )}
          <Avatar className="mt-0.5 h-4 w-4">
            <AvatarImage src={ctx.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-[9px] text-white">
              {ctx.author.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded border border-brand-100 bg-slate-50 px-2 py-1">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-900">{ctx.author.name}</span>
              <span className="text-[10px] text-gray-400">
                {ctx.createdAt ? getTimeAgo(new Date(ctx.createdAt)) : "Unknown date"}
              </span>
            </div>
            <div
              className="prose prose-xs max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: removeTrailingEmptyPTags(ctx.content) }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <Card className="rounded-xl border bg-white/80 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center pr-2">
              <VotingActions postid={postId(reply.id)} score={reply.upvotes - reply.downvotes} />
            </div>
            <div className="flex-1">
              {/* Top row: author info right-aligned */}
              <div className="mb-1 flex items-center justify-end gap-2">
                <Link
                  href={`/u/${reply.author.username.replace("lens/", "")}`}
                  className="flex items-center gap-2 hover:text-brand-600"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-[10px] text-white">
                      {reply.author.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-900">{reply.author.name}</span>
                </Link>
                <span className="text-xs text-gray-400">
                  {reply.createdAt ? getTimeAgo(new Date(reply.createdAt)) : "Unknown date"}
                </span>
              </div>
              {/* Context fetcher for parent post chain */}
              {reply.parentReplyId && reply.parentReplyId !== rootPostId && (
                <div className="mb-2">
                  <button
                    className={
                      `inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors ` +
                      (showContext
                        ? "border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
                        : "bg-transparent text-brand-500 hover:text-brand-700")
                    }
                    onClick={handleShowContext}
                    disabled={loadingContext}
                    aria-pressed={showContext}
                    title={showContext ? "Hide context" : "Show context"}
                  >
                    {/* Use a Lucide icon for context, e.g. LucideLink2 */}
                    <span className="inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7a5 5 0 0 1 0-10h2m1 5h4"
                        />
                      </svg>
                    </span>
                    {loadingContext ? "Loading..." : showContext ? "Hide context" : "Show context"}
                  </button>
                  {showContext && contextChain.length > 0 && <ContextChain />}
                </div>
              )}
              {/* Content */}
              <div
                className="mb-2 max-w-none text-sm text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_li]:mb-1 [&_p]:min-h-[1.2em] [&_pre]:rounded-md [&_pre]:bg-gray-100 [&_pre]:p-2 [&_ul]:ml-4 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: removeTrailingEmptyPTags(reply.content) }}
              />
              {/* Reply button bottom right */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1 text-xs text-brand-600 hover:text-brand-700"
                  onClick={() => setReplyingTo(reply.id)}
                  disabled={!isLoggedIn}
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              </div>
              {replyingTo === reply.id && (
                <ThreadReplyBox
                  value={replyContent[reply.id] || ""}
                  onCancel={() => {
                    setReplyingTo(null);
                    setReplyContent(c => ({ ...c, [reply.id]: "" }));
                  }}
                  onSubmit={async () => {
                    const raw = replyContent[reply.id] || "";
                    const withoutTrailingPTags = removeTrailingEmptyPTags(raw);
                    const trimmed = withoutTrailingPTags.replace(/(\S)(\s+)$/g, "$1");
                    if (!trimmed.trim()) return;
                    await handleReply(reply.id, trimmed);
                    setReplyContent(c => ({ ...c, [reply.id]: "" }));
                  }}
                  onChange={val => {
                    const trimmed = val.replace(/(\S)(\s+)$/g, "$1");
                    setReplyContent(c => ({ ...c, [reply.id]: trimmed }));
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
