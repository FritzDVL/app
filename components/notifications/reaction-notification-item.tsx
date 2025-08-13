import Link from "next/link";
import { AvatarProfileLink } from "@/components/notifications/avatar-profile-link";
import { NotificationCard } from "@/components/notifications/notification-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/lib/shared/utils";
import type { ReactionNotification } from "@lens-protocol/client";
import { PostReactionType } from "@lens-protocol/client";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ReactionNotificationItem({ notification }: { notification: ReactionNotification }) {
  const reactions = notification.reactions;
  const post = notification.post;

  // Get first reaction details
  const firstReaction = reactions[0];
  const firstAuthor = (firstReaction as any).account || (firstReaction as any).by || notification.post.author;
  const reactionType = (firstReaction as any).type || (firstReaction as any).reaction || PostReactionType.Upvote;
  const firstAuthorUsername = firstAuthor.username?.value || firstAuthor.username?.localName;

  const isUpvote = reactionType === PostReactionType.Upvote;
  const totalReactions = reactions.length;
  const additionalReactions = totalReactions - 1;

  // Get multiple authors for avatar display (max 3)
  const displayAuthors = reactions.slice(0, 3).map(reaction => ({
    author: (reaction as any).account || (reaction as any).by || notification.post.author,
    reaction,
  }));

  // Build the reaction message
  const getReactionMessage = () => {
    const authorName = firstAuthor.metadata?.name || firstAuthor.username?.localName;
    const actionWord = isUpvote ? "upvoted" : "downvoted";

    if (additionalReactions === 0) {
      return `${authorName} ${actionWord} your post`;
    } else if (additionalReactions === 1) {
      return `${authorName} and 1 other ${actionWord} your post`;
    } else {
      return `${authorName} and ${additionalReactions} others ${actionWord} your post`;
    }
  };

  // Extract post title from metadata based on type
  const postTitle =
    post.metadata?.__typename === "ArticleMetadata"
      ? post.metadata.title
      : post.metadata?.__typename === "TextOnlyMetadata"
        ? post.metadata.content?.slice(0, 50) + "..."
        : "your post";

  // Determine if this is a reply or a thread
  const isReply = post.metadata?.__typename === "TextOnlyMetadata";
  const threadAddress = post.feed.address;
  const navigationUrl = `/thread/${threadAddress}${isReply ? `/reply/${post.id}` : ""}`;

  return (
    <NotificationCard href={navigationUrl}>
      <div className="flex items-start gap-4">
        <AvatarProfileLink author={firstAuthor} />
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
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 dark:text-gray-100">
                  {getReactionMessage()}
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
    </NotificationCard>
  );
}
