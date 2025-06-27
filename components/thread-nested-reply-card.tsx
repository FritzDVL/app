import Link from "next/link";
import { ThreadReplyBox } from "./thread-reply-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeAgo } from "@/lib/utils";
import { Reply } from "lucide-react";

export function ThreadNestedReplyCard({
  nestedReply,
  replyingTo,
  replyContent,
  setReplyingTo,
  setReplyContent,
}: {
  nestedReply: any;
  replyingTo: string | null;
  replyContent: { [key: string]: string };
  setReplyingTo: (id: string | null) => void;
  setReplyContent: (fn: (c: any) => any) => void;
}) {
  return (
    <Card className="gradient-card border border-brand-200/30 bg-brand-50/30">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={nestedReply.author.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
              {nestedReply.author.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <Link
                href={`/u/${nestedReply.author.username}`}
                className="font-medium text-gray-900 hover:text-brand-600"
              >
                {nestedReply.author.name}
              </Link>
              <span className="text-sm text-gray-500">
                {nestedReply.createdAt ? getTimeAgo(new Date(nestedReply.createdAt)) : "Unknown date"}
              </span>
            </div>
            <p className="text-sm text-gray-700">{nestedReply.content}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-brand-600 hover:text-brand-700"
              onClick={() => setReplyingTo(nestedReply.id)}
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
            {replyingTo === nestedReply.id && (
              <ThreadReplyBox
                value={replyContent[nestedReply.id] || ""}
                onChange={e =>
                  setReplyContent(c => ({
                    ...c,
                    [nestedReply.id]: e.target.value,
                  }))
                }
                onCancel={() => {
                  setReplyingTo(null);
                  setReplyContent(c => ({
                    ...c,
                    [nestedReply.id]: "",
                  }));
                }}
                onSubmit={() => {
                  setReplyingTo(null);
                  setReplyContent(c => ({
                    ...c,
                    [nestedReply.id]: "",
                  }));
                }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
