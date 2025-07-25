import React from "react";

interface NotificationsErrorProps {
  error: string;
}

export function NotificationsError({ error }: NotificationsErrorProps) {
  return (
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
  );
}
