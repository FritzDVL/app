import { useEffect, useState } from "react";
import Link from "next/link";
import ContentRenderer from "@/components/shared/content-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { storageClient } from "@/lib/external/grove/client";
import { getTimeAgo } from "@/lib/shared/utils";
import type { CommentNotification } from "@lens-protocol/client";
import { MessageCircle } from "lucide-react";

export function ReplyNotificationItem({ notification }: { notification: CommentNotification }) {
  const [content, setContent] = useState<string | null>(null);
  const { author, timestamp } = notification.comment;
  useEffect(() => {
    const doFetchReplyContent = async () => {
      const replyUrl = storageClient.resolve(notification.comment.contentUri);
      const replyContent = await fetch(replyUrl);
      if (!replyContent.ok) {
        console.error("Failed to fetch reply content:", replyContent.statusText);
        return;
      }
      const replyText = await replyContent.json();
      setContent(replyText.lens.content);
    };
    doFetchReplyContent();
  }, [notification]);

  // Navigation URLs
  const threadAddress = notification.comment.feed.address;
  const replyId = notification.comment.id;
  const viewReplyUrl = `/thread/${threadAddress}/reply/${replyId}`;

  return (
    <Link
      href={viewReplyUrl}
      className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400/30 hover:bg-brand-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-900/20"
    >
      <div className="flex items-start gap-4">
        {author && (
          <Link
            href={`/u/${notification.comment.author.username?.value}`}
            onClick={e => e.stopPropagation()}
            className="z-10 flex-shrink-0"
            tabIndex={0}
            aria-label={`Go to @${notification.comment.author.username?.localName} profile`}
          >
            <Avatar className="h-12 w-12 ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-700">
              <AvatarImage src={author.metadata?.picture || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                {author.username?.localName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
                <MessageCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 dark:text-gray-100">
                  @{author?.username?.localName} replied to your post
                </h3>
                {notification.comment.feed.metadata && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      in "{(notification.comment.feed.metadata.description?.length ?? 0) > 50
                        ? (notification.comment.feed.metadata.description?.slice(0, 50) ?? "") + "..."
                        : (notification.comment.feed.metadata.description ?? "")}"</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(new Date(timestamp))}</span>
            </div>
          </div>
          {content && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
              <ContentRenderer
                content={content.length > 150 ? content.slice(0, 150) + "..." : content}
                className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
