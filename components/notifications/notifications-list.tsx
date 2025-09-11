import { NotificationItem } from "@/components/notifications/notification-item";
import { StatusBanner } from "@/components/shared/status-banner";
import { Notification } from "@lens-protocol/client";
import { Bell } from "lucide-react";

interface NotificationsListProps {
  filter: "all" | "mentions" | "comments" | "reactions" | "rewards";
  notifications: Notification[];
}

export function NotificationsList({ filter, notifications }: NotificationsListProps) {
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "mentions") return notification.__typename === "MentionNotification";
    if (filter === "comments") return notification.__typename === "CommentNotification";
    if (filter === "reactions") return notification.__typename === "ReactionNotification";
    if (filter === "rewards") return notification.__typename === "TokenDistributedNotification";
    return true;
  });

  if (filteredNotifications.length === 0) {
    return (
      <StatusBanner
        type="info"
        title="No notifications"
        message={`No notifications found.`}
        icon={<Bell className="h-8 w-8 text-gray-400" />}
      />
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
