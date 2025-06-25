import Link from "next/link";
import { ThreadReplyActions } from "./thread-reply-actions";
import { ThreadReplyBox } from "./thread-reply-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reply as ReplyType } from "@/types/common";
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
    <div className="space-y-4" style={{ marginLeft: depth * 24 }}>
      <Card className="gradient-card border border-brand-200/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <ThreadReplyActions score={reply.upvotes - reply.downvotes} />
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-2">
                <Link href={`/u/${reply.author.username}`} className="flex items-center space-x-2 hover:text-brand-600">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
                      {reply.author.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">{reply.author.name}</span>
                </Link>
                <span className="text-sm text-gray-500">
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Unknown date"}
                </span>
              </div>
              <p className="mb-3 text-gray-700">{reply.content}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-600 hover:text-brand-700"
                onClick={() => setReplyingTo(reply.id)}
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </Button>
              {replyingTo === reply.id && (
                <ThreadReplyBox
                  value={replyContent[reply.id] || ""}
                  onChange={e =>
                    setReplyContent(c => ({
                      ...c,
                      [reply.id]: e.target.value,
                    }))
                  }
                  onCancel={() => {
                    setReplyingTo(null);
                    setReplyContent(c => ({ ...c, [reply.id]: "" }));
                  }}
                  onSubmit={async () => {
                    if (!replyContent[reply.id]?.trim()) return;
                    await handleReply(reply.id, replyContent[reply.id]);
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
