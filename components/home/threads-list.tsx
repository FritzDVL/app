import { ThreadListItem } from "@/components/home/thread-list-item";
import { StatusBanner } from "@/components/shared/status-banner";
import { Button } from "@/components/ui/button";
import { Thread } from "@/lib/domain/threads/types";
import { Edit3, MessageCircle } from "lucide-react";

interface LatestThreadsProps {
  threads: Thread[];
  loadingThreads: boolean;
  error: any;
}

export function ThreadsList({ threads, loadingThreads, error }: LatestThreadsProps) {
  return (
    <div className="w-full max-w-none overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Table Header */}
      <div className="hidden border-b border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 sm:flex">
        <div className="flex-1">Topic</div>
        <div className="w-32 px-2">Posters</div>
        <div className="w-20 px-2 text-center">Replies</div>
        <div className="w-20 px-2 text-center">Views</div>
        <div className="w-24 pl-2 text-right">Activity</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100 dark:divide-gray-800">
        {loadingThreads ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4">
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-gray-800"></div>
                <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8">
            <StatusBanner type="error" title={error.message || "Failed to load threads"} icon={null} />
          </div>
        ) : threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageCircle className="mb-4 h-12 w-12 text-slate-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100">No threads found</h3>
            <p className="mt-1 text-slate-500 dark:text-gray-400">
              Be the first to start a conversation in this category.
            </p>
            <div className="mt-6">
              <Button className="rounded-full bg-brand-600 px-6 text-white hover:bg-brand-700">
                <Edit3 className="mr-2 h-4 w-4" />
                Create Thread
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {threads.map(thread => (
              <ThreadListItem key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
