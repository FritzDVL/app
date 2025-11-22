"use client";

import { useMemo, useState } from "react";
import { ThreadListItem } from "@/components/home/thread-list-item";
import { StatusBanner } from "@/components/shared/status-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { MessageCircle, Search } from "lucide-react";

export function CommunityThreadsList({ threads }: { threads: Thread[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const loading = false;

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const query = searchQuery.toLowerCase();
    return threads.filter(t => {
      const { title, summary } = getThreadTitleAndSummary(t.rootPost);
      return (title && title.toLowerCase().includes(query)) || (summary && summary.toLowerCase().includes(query));
    });
  }, [threads, searchQuery]);

  return (
    <div className="w-full max-w-none overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="flex items-center text-xl font-bold text-foreground">
            <MessageCircle className="mr-2 h-5 w-5 text-brand-500" />
            Threads
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-800"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden border-b border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 sm:flex">
        <div className="flex-1">Topic</div>
        <div className="w-32 px-2">Posters</div>
        <div className="w-20 px-2 text-center">Replies</div>
        <div className="w-20 px-2 text-center">Views</div>
        <div className="w-24 pl-2 text-right">Activity</div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-gray-800">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading threads..." />
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="py-12">
            <StatusBanner
              type="info"
              title="No threads found"
              message={
                searchQuery ? "Try adjusting your search terms" : "Be the first to start a thread in this community!"
              }
              icon={<MessageCircle className="h-10 w-10 text-slate-400" />}
            />
          </div>
        ) : (
          <div>
            {filteredThreads.map(thread => (
              <ThreadListItem key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
