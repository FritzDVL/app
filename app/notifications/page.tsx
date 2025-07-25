"use client";

import { useState } from "react";
import { NotificationsFilter } from "@/components/notifications/notifications-filter";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { useSessionClient } from "@lens-protocol/react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "mentions" | "comments" | "reactions">("all");
  const sessionClient = useSessionClient();
  const { notifications, loading, error } = useNotifications(sessionClient);

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
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <div className="text-red-600 dark:text-red-400">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-red-900 dark:text-red-100">Error loading notifications</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      ) : (
        <NotificationsList filter={filter} notifications={notifications} />
      )}
    </div>
  );
}
