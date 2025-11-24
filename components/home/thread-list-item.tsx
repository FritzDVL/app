import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { getCategoryFromTags } from "@/lib/shared/categories";
import { getTimeAgo } from "@/lib/shared/utils";
import { EyeOff, Pin } from "lucide-react";

export function ThreadListItem({ thread }: { thread: Thread }) {
  const { title } = getThreadTitleAndSummary(thread.rootPost);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (thread.rootPost.metadata as any)?.tags || [];
  const category = getCategoryFromTags(tags);

  return (
    <div className="group flex flex-col border-b border-slate-100 py-3 last:border-0 hover:bg-slate-50 dark:border-gray-800 dark:hover:bg-gray-800/50 sm:flex-row sm:items-center">
      {/* Topic Column */}
      <div className="min-w-0 flex-1 pr-4">
        <div className="mb-1">
          <Link
            href={`/thread/${thread.slug}`}
            className={`text-[17px] font-semibold leading-snug text-slate-900 hover:text-brand-600 dark:text-gray-100 dark:hover:text-brand-400 ${!thread.isVisible ? "opacity-50" : ""}`}
          >
            {thread.featured && <Pin className="mr-2 inline-block h-4 w-4 text-slate-500" />}
            {!thread.isVisible && <EyeOff className="mr-2 inline-block h-4 w-4 text-red-500" />}
            {title}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1">
            <span className={`h-2.5 w-2.5 rounded-[2px] ${category.color}`} />
            <span className="font-bold text-slate-500 dark:text-gray-400">{category.label}</span>
          </span>

          {/* Additional Tags as Badges */}
          {tags
            .filter((t: string) => t !== category.hashtag && t.startsWith("#"))
            .slice(0, 3)
            .map((tag: string, idx: number) => (
              <span
                key={idx}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}

          {/* Mobile Stats (Visible only on mobile) */}
          <span className="ml-auto flex items-center gap-3 sm:hidden">
            <span className="text-slate-500 dark:text-gray-400">{getTimeAgo(new Date(thread.created_at))}</span>
            <span
              className={`font-medium ${thread.repliesCount > 0 ? "text-orange-600 dark:text-orange-500" : "text-slate-400 dark:text-gray-500"}`}
            >
              {thread.repliesCount || 0} replies
            </span>
          </span>
        </div>
      </div>

      {/* Posters / Avatars Column */}
      <div className="hidden w-32 items-center justify-start -space-x-1 px-2 sm:flex">
        <Avatar className="h-6 w-6 border-2 border-white ring-1 ring-slate-100 dark:border-gray-900 dark:ring-gray-800">
          <AvatarImage src={thread.author.metadata?.picture || undefined} />
          <AvatarFallback className="bg-brand-100 text-[10px] text-brand-700">
            {thread.author.username?.localName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Mock additional participants to match the look */}
        {[1, 2].map(i => (
          <div
            key={i}
            className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 ring-1 ring-slate-100 dark:border-gray-900 dark:bg-gray-700 dark:ring-gray-800"
          />
        ))}
      </div>

      {/* Replies Column */}
      <div className="hidden w-20 px-2 text-center sm:block">
        <span
          className={`text-[15px] font-medium ${thread.repliesCount > 0 ? "text-orange-600 dark:text-orange-500" : "text-slate-400 dark:text-gray-500"}`}
        >
          {thread.repliesCount || 0}
        </span>
      </div>

      {/* Views Column */}
      <div className="hidden w-20 px-2 text-center sm:block">
        <span className="text-[15px] text-slate-400 dark:text-gray-500">123</span>
      </div>

      {/* Activity Column */}
      <div className="hidden w-24 pl-2 text-right sm:block">
        <span className="text-[15px] text-slate-500 dark:text-gray-400">{getTimeAgo(new Date(thread.created_at))}</span>
      </div>
    </div>
  );
}
