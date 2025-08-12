import Link from "next/link";
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

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        {/* Multiple avatars display */}
        <div className="flex-shrink-0">
          {displayAuthors.length === 1 ? (
            // Single avatar
            firstAuthor &&
            firstAuthorUsername && (
              <Link href={`/u/${firstAuthorUsername}`}>
                <Avatar className="h-12 w-12 ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-700">
                  <AvatarImage src={firstAuthor.metadata?.picture || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                    {firstAuthor.metadata?.name?.[0]?.toUpperCase() ||
                      firstAuthor.username?.localName?.[0]?.toUpperCase() ||
                      "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )
          ) : (
            // Multiple avatars stacked
            <div className="flex">
              {displayAuthors.map((item, index) => {
                const { author } = item;
                const username = author.username?.value || author.username?.localName;
                return (
                  <div key={index} className={`${index > 0 ? "-ml-2" : ""} relative`}>
                    {username ? (
                      <Link href={`/u/${username}`}>
                        <Avatar className="h-10 w-10 ring-2 ring-white transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-800">
                          <AvatarImage src={author.metadata?.picture || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                            {author.metadata?.name?.[0]?.toUpperCase() ||
                              author.username?.localName?.[0]?.toUpperCase() ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    ) : (
                      <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
                        <AvatarImage src={author.metadata?.picture || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                          {author.metadata?.name?.[0]?.toUpperCase() ||
                            author.username?.localName?.[0]?.toUpperCase() ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              {/* Show "+N" if there are more than 3 reactions */}
              {totalReactions > 3 && (
                <div className="relative -ml-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-800">
                    +{totalReactions - 3}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{getReactionMessage()}</h3>
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
