import Link from "next/link";
import ContentRenderer from "@/components/shared/content-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/lib/utils";
import type { MentionNotification } from "@lens-protocol/client";
import { Users } from "lucide-react";

export function MentionNotificationItem({ notification }: { notification: MentionNotification }) {
  const author = notification.post.author;
  const post = notification.post;
  const authorUsername = author.username?.value || author.username?.localName;

  // Extract post title from metadata based on type
  const postTitle =
    post.metadata?.__typename === "ArticleMetadata"
      ? post.metadata.title
      : post.metadata?.__typename === "TextOnlyMetadata"
        ? post.metadata.content?.slice(0, 50) + "..."
        : "a post";

  const postContent =
    post.metadata?.__typename === "ArticleMetadata"
      ? post.metadata.content
      : post.metadata?.__typename === "TextOnlyMetadata"
        ? post.metadata.content
        : null;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {author && authorUsername && (
          <Link href={`/u/${authorUsername}`} className="flex-shrink-0">
            <Avatar className="h-12 w-12 ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-700">
              <AvatarImage src={author.metadata?.picture || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                {author.metadata?.name?.[0]?.toUpperCase() || author.username?.localName?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {author.metadata?.name || author.username?.localName} mentioned you
                </h3>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">in &ldquo;{postTitle}&rdquo;</span>
                </p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(new Date(post.timestamp))}</span>
            </div>
          </div>
          {postContent && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
              <ContentRenderer
                content={postContent.length > 150 ? postContent.slice(0, 150) + "..." : postContent}
                className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
