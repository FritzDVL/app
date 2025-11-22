"use client";

import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { CommunitySidebar } from "@/components/communities/display/community-sidebar";
import { CommunityThreadsList } from "@/components/communities/threads/community-threads-list";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useThreadsPaginated } from "@/hooks/threads/use-threads-paginated";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

interface CommunityThreadsProps {
  community: Community;
  threads: Thread[];
}

export function CommunityThreads({ community, threads: initialThreads }: CommunityThreadsProps) {
  const { threads, loading, next, prev, hasNext, hasPrev } = useThreadsPaginated({
    community,
    initialThreads,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <CommunityNavActions community={community} />
          <CommunityHeader community={community} />
          {loading ? (
            <div className="flex w-full items-center justify-center py-12">
              <LoadingSpinner text="Loading threads..." />
            </div>
          ) : (
            <CommunityThreadsList threads={threads} />
          )}
          <Pagination onPrev={prev} onNext={next} hasPrev={hasPrev} hasNext={hasNext} loading={loading} />
        </div>
        <div className="space-y-8 lg:pt-[54px]">
          <CommunitySidebar community={community} />
        </div>
      </div>
    </main>
  );
}
