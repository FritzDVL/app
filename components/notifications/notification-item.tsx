import { MentionNotificationItem } from "./mention-notification-item";
import { ReactionNotificationItem } from "./reaction-notification-item";
import { ReplyNotificationItem } from "./reply-notification-item";
import { TokenDistributionNotificationItem } from "./token-distribution-notification-item";
import type { Notification } from "@lens-protocol/client";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  switch (notification.__typename) {
    case "MentionNotification":
      return <MentionNotificationItem notification={notification} />;
    case "CommentNotification":
      return <ReplyNotificationItem notification={notification} />;
    case "ReactionNotification":
      return <ReactionNotificationItem notification={notification} />;
    case "TokenDistributedNotification":
      return <TokenDistributionNotificationItem notification={notification} />;
    default:
      return null;
  }
}
