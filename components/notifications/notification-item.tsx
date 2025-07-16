import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, MessageCircle, Users } from "lucide-react";

interface NotificationActor {
  username: string;
  name: string;
  avatar: string | null;
}

interface NotificationContent {
  text?: string;
  threadTitle: string;
  reactionType?: "upvote" | "downvote";
}

interface Notification {
  id: string;
  type: "mention" | "comment" | "reaction";
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor;
  content: NotificationContent;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const { type, isRead, createdAt, actor, content } = notification;

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "mention":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "reaction":
        return content.reactionType === "upvote" ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "mention":
        return `${actor.name} mentioned you`;
      case "comment":
        return `${actor.name} replied to your post`;
      case "reaction":
        return `${actor.name} ${content.reactionType === "upvote" ? "upvoted" : "downvoted"} your post`;
      default:
        return "";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`group rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${
        isRead
          ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          : "border-brand-200 bg-brand-50/50 dark:border-brand-700 dark:bg-brand-900/20"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link href={`/u/${actor.username}`} className="flex-shrink-0">
          <Avatar className="h-12 w-12 ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-700">
            <AvatarImage src={actor.avatar || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
              {actor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header with icon, title and timestamp */}
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-full p-1.5 ${
                  type === "mention"
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : type === "comment"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-orange-100 dark:bg-orange-900/30"
                }`}
              >
                {getIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{getTitle()}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  in{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    &ldquo;{content.threadTitle}&rdquo;
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(createdAt)}</span>
              {!isRead && <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500"></span>}
            </div>
          </div>

          {/* Notification content */}
          {content.text && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{content.text}&rdquo;</p>
            </div>
          )}

          {/* Mark as read button for unread notifications */}
          {!isRead && (
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="text-xs text-brand-600 hover:bg-brand-100 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/30"
              >
                Mark as read
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
