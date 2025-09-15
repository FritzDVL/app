"use client";

import { useMemo, useState } from "react";
import { CommunityThreadCard } from "@/components/communities/threads/community-thread-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h2 className="mb-3 flex items-center text-2xl font-bold text-foreground">
            <MessageCircle className="mr-3 h-6 w-6 text-brand-500" />
            Threads
          </h2>
        </div>
        <div className="mt-6">
          <div className="relative max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-background focus:shadow-md focus:shadow-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading threads..." />
          </div>
        ) : filteredThreads.length === 0 ? (
          <StatusBanner
            type="info"
            title="No threads yet"
            message="Be the first to start a thread in this community!"
            icon={<MessageCircle className="h-10 w-10 text-slate-400" />}
          />
        ) : (
          <div className="space-y-4">
            {filteredThreads.map(thread => (
              <CommunityThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
