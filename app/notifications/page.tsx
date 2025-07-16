"use client";

import { useState } from "react";
import { NotificationsFilter } from "@/components/notifications/notifications-filter";
import { NotificationsList } from "@/components/notifications/notifications-list";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "mentions" | "comments" | "reactions">("all");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay updated with mentions, replies, and votes on your posts
          </p>
        </div>
      </div>

      <div className="mb-6">
        <NotificationsFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <NotificationsList filter={filter} />
    </div>
  );
}
