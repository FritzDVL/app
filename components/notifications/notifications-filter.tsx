import { Button } from "@/components/ui/button";
import type { Notification } from "@lens-protocol/client";
import { ArrowUp, Bell, MessageCircle, Users } from "lucide-react";

interface NotificationsFilterProps {
  currentFilter: "all" | "mentions" | "comments" | "reactions";
  onFilterChange: (filter: "all" | "mentions" | "comments" | "reactions") => void;
  notifications: Notification[];
}

function getNotificationCounters(notifications: Notification[]) {
  const counters = { all: 0, mentions: 0, comments: 0, reactions: 0 };
  for (const n of notifications) {
    counters.all++;
    if (n.__typename === "MentionNotification") counters.mentions++;
    else if (n.__typename === "CommentNotification") counters.comments++;
    else if (n.__typename === "ReactionNotification") counters.reactions++;
  }
  return counters;
}

export function NotificationsFilter({ currentFilter, onFilterChange, notifications }: NotificationsFilterProps) {
  const counters = getNotificationCounters(notifications);
  const filters = [
    { key: "all" as const, label: "All", icon: Bell, count: counters.all },
    { key: "mentions" as const, label: "Mentions", icon: Users, count: counters.mentions },
    { key: "comments" as const, label: "Replies", icon: MessageCircle, count: counters.comments },
    { key: "reactions" as const, label: "Reactions", icon: ArrowUp, count: counters.reactions },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => {
        const Icon = filter.icon;
        const isActive = currentFilter === filter.key;

        return (
          <Button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`rounded-full transition-all duration-300 ${
              isActive
                ? "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                : "hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            }`}
          >
            <Icon className="mr-2 h-4 w-4" />
            {filter.label}
            {filter.count > 0 && (
              <span
                className={`ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {filter.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
