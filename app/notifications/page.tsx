"use client";

import { useState } from "react";
import { NotificationsFilter } from "@/components/notifications/notifications-filter";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "mentions" | "comments" | "reactions">("all");

  const handleMarkAllRead = () => {
    // TODO: Implement mark all as read functionality
    console.log("Mark all notifications as read");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay updated with mentions, replies, and votes on your posts
          </p>
        </div>
        <Button
          onClick={handleMarkAllRead}
          variant="outline"
          size="sm"
          className="rounded-full transition-all duration-300 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-300"
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="mb-6">
        <NotificationsFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <NotificationsList filter={filter} />
    </div>
  );
}
