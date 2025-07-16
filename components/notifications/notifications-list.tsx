import { useState } from "react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Bell } from "lucide-react";

// Mock notification data - replace with actual Lens API data later
const mockNotifications = [
  {
    id: "1",
    type: "mention" as const,
    isRead: false,
    createdAt: "2025-07-16T10:30:00Z",
    actor: {
      username: "alice",
      name: "Alice Cooper",
      avatar: null,
    },
    content: {
      text: "Great discussion on decentralized governance! @danieltome what are your thoughts on this?",
      threadTitle: "The Future of DeFi Governance",
    },
  },
  {
    id: "2",
    type: "comment" as const,
    isRead: false,
    createdAt: "2025-07-16T09:15:00Z",
    actor: {
      username: "bob_lens",
      name: "Bob Smith",
      avatar: null,
    },
    content: {
      text: "I completely agree with your points about user experience. This is exactly what the ecosystem needs.",
      threadTitle: "Improving UX in Web3 Applications",
    },
  },
  {
    id: "3",
    type: "reaction" as const,
    isRead: true,
    createdAt: "2025-07-16T08:45:00Z",
    actor: {
      username: "charlie_dev",
      name: "Charlie Wilson",
      avatar: null,
    },
    content: {
      reactionType: "upvote" as const,
      threadTitle: "Building Scalable dApps with Lens Protocol",
    },
  },
  {
    id: "4",
    type: "mention" as const,
    isRead: true,
    createdAt: "2025-07-15T16:20:00Z",
    actor: {
      username: "diana_web3",
      name: "Diana Rodriguez",
      avatar: null,
    },
    content: {
      text: "Hey @danieltome, would love to get your input on this proposal for community governance.",
      threadTitle: "Community Governance Proposal v2",
    },
  },
  {
    id: "5",
    type: "comment" as const,
    isRead: true,
    createdAt: "2025-07-15T14:10:00Z",
    actor: {
      username: "eve_crypto",
      name: "Eve Thompson",
      avatar: null,
    },
    content: {
      text: "This is a game-changer! The implementation details you shared are very helpful.",
      threadTitle: "New Feature: Real-time Notifications",
    },
  },
  {
    id: "6",
    type: "reaction" as const,
    isRead: true,
    createdAt: "2025-07-15T12:30:00Z",
    actor: {
      username: "frank_builder",
      name: "Frank Martinez",
      avatar: null,
    },
    content: {
      reactionType: "downvote" as const,
      threadTitle: "Controversial Take on Gas Fees",
    },
  },
];

interface NotificationsListProps {
  filter: "all" | "mentions" | "comments" | "reactions";
}

export function NotificationsList({ filter }: NotificationsListProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "mentions") return notification.type === "mention";
    if (filter === "comments") return notification.type === "comment";
    if (filter === "reactions") return notification.type === "reaction";
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification => (notification.id === id ? { ...notification, isRead: true } : notification)),
    );
  };

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
      {filteredNotifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
      ))}
    </div>
  );
}
