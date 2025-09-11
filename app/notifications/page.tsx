"use client";

import { useState } from "react";
import { NotificationsFilter } from "@/components/notifications/notifications-filter";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { StatusBanner } from "@/components/shared/status-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/hooks/notifications/use-notifications";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "mentions" | "comments" | "reactions" | "rewards">("all");
  const { notifications, loading, error } = useNotifications();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay up to date with mentions, replies and reactions to your posts
          </p>
        </div>
      </div>

      <div className="mb-6">
        <NotificationsFilter currentFilter={filter} onFilterChange={setFilter} notifications={notifications} />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your notifications..." />
      ) : error ? (
        <StatusBanner type="error" title="Error loading notifications" message={error} />
      ) : (
        <NotificationsList filter={filter} notifications={notifications} />
      )}
    </div>
  );
}
