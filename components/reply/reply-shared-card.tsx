import ContentRenderer from "@/components/shared/content-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getReplyContent } from "@/lib/domain/replies/content";
import { getThreadContent } from "@/lib/domain/threads/content";
import { getTimeAgo } from "@/lib/shared/utils";
import { MediaImage, MediaVideo, Post } from "@lens-protocol/client";

export function ReplySharedCard({ reply }: { reply: Post }) {
  const author = reply.author;
  let content: { content: string; image?: MediaImage; video?: MediaVideo };
  switch (reply.metadata.__typename) {
    case "TextOnlyMetadata":
      content = getReplyContent(reply);
      break;
    case "ArticleMetadata":
      content = getThreadContent(reply);
      break;
    default:
      content = { content: "" };
      break;
  }
  return (
    <Card className="rounded-lg bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            {/* Top row: author info */}
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                <AvatarImage src={author.metadata?.picture} />
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                  {author.metadata?.name?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{author.metadata?.name}</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{getTimeAgo(new Date(reply.timestamp))}</span>
            </div>
            {/* Content */}
            <div className="rich-text-content mb-2">
              <ContentRenderer content={content} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
