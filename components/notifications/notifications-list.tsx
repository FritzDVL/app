import { NotificationItem } from "@/components/notifications/notification-item";
import { Notification } from "@lens-protocol/client";
import { Bell } from "lucide-react";

interface NotificationsListProps {
  filter: "all" | "mentions" | "comments" | "reactions";
  notifications: Notification[];
}

export function NotificationsList({ filter, notifications }: NotificationsListProps) {
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "mentions") return notification.__typename === "MentionNotification";
    if (filter === "comments") return notification.__typename === "CommentNotification";
    if (filter === "reactions") return notification.__typename === "ReactionNotification";
    return true;
  });

  if (filteredNotifications.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <div className="text-gray-500 dark:text-gray-400">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
            <Bell className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No notifications</h3>
          <p className="text-sm">
            {filter === "all"
              ? "You're all caught up! No new notifications."
              : `No ${filter === "comments" ? "replies" : filter} notifications found.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredNotifications.map((notification: Notification, idx: number) => (
        <NotificationItem key={idx} notification={notification} />
      ))}
    </div>
  );
}
