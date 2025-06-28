import Link from "next/link";
import { ThreadReplyBox } from "./thread-reply-box";
import { VotingActions } from "./voting-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/utils";
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
  depth = 0,
}: {
  reply: ReplyType & { _depth?: number };
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
  handleReply: (parentId: string, content: string) => Promise<void>; // <-- type
  children?: React.ReactNode;
  depth?: number;
}) {
  return (
    <div className="space-y-2" style={{ marginLeft: depth * 18 }}>
      <Card className="border border-brand-100 bg-white/80 shadow-sm">
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
