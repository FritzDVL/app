import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getTimeAgo } from "@/lib/shared/utils";

export function ThreadListItem({ thread }: { thread: Thread }) {
  const { title } = getThreadTitleAndSummary(thread.rootPost);
  // Mock category for now based on title or random
  const category = { label: "General", color: "bg-slate-500" };

  return (
    <div className="group flex items-center border-b border-slate-100 py-3 last:border-0 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
      {/* Main Topic Info */}
      <div className="min-w-0 flex-1 pr-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/thread/${thread.slug}`}
            className="line-clamp-1 text-[17px] font-semibold text-slate-900 hover:text-brand-600 dark:text-gray-100 dark:hover:text-brand-400"
          >
            {title}
          </Link>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-sm px-1.5 py-0.5 font-medium text-white ${category.color}`}
          >
            {category.label}
          </span>
          <span className="text-slate-500 dark:text-gray-400">{/* Tag list could go here */}</span>
        </div>
      </div>

      {/* Posters / Avatars */}
      <div className="hidden w-32 items-center -space-x-2 px-2 sm:flex">
        <Avatar className="h-6 w-6 border-2 border-white dark:border-gray-900">
          <AvatarImage src={thread.author.metadata?.picture || undefined} />
          <AvatarFallback className="bg-brand-100 text-[10px] text-brand-700">
            {thread.author.username?.localName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Mock additional participants */}
        {[1, 2].map(i => (
          <div
            key={i}
            className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 dark:border-gray-900 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Stats */}
      <div className="hidden w-20 flex-col items-center justify-center px-2 text-center sm:flex">
        <span className="text-base font-medium text-slate-700 dark:text-gray-300">{thread.repliesCount || 0}</span>
        <span className="text-[11px] text-slate-500">Replies</span>
      </div>
      <div className="hidden w-20 flex-col items-center justify-center px-2 text-center sm:flex">
        <span className="text-base font-medium text-slate-700 dark:text-gray-300">123</span>
        <span className="text-[11px] text-slate-500">Views</span>
      </div>

      {/* Activity */}
      <div className="hidden w-24 flex-col items-end justify-center pl-2 text-right text-xs text-slate-500 sm:flex">
        <span>{getTimeAgo(new Date(thread.created_at))}</span>
      </div>
    </div>
  );
}
