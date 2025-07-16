import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/lib/utils";
import type { ReactionNotification } from "@lens-protocol/client";
import { PostReactionType } from "@lens-protocol/client";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ReactionNotificationItem({ notification }: { notification: ReactionNotification }) {
  const reaction = notification.reactions[0];
  const author = (reaction as any).account || (reaction as any).by || notification.post.author;
  const post = notification.post;
  const reactionType = (reaction as any).type || (reaction as any).reaction || PostReactionType.Upvote;
  const authorUsername = author.username?.value || author.username?.localName;

  const isUpvote = reactionType === PostReactionType.Upvote;

  // Extract post title from metadata based on type
  const postTitle =
    post.metadata?.__typename === "ArticleMetadata"
      ? post.metadata.title
      : post.metadata?.__typename === "TextOnlyMetadata"
        ? post.metadata.content?.slice(0, 50) + "..."
        : "your post";

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
              <div className="rounded-full bg-orange-100 p-1.5 dark:bg-orange-900/30">
                {isUpvote ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {author.metadata?.name || author.username?.localName} {isUpvote ? "upvoted" : "downvoted"} your post
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">&ldquo;{postTitle}&rdquo;</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(new Date(post.timestamp))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
