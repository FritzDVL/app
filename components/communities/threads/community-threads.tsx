"use client";

import { useState } from "react";
import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { CommunitySidebar } from "@/components/communities/display/community-sidebar";
import { CommunityThreadsList } from "@/components/communities/threads/community-threads-list";
import { CrosspostSwitch } from "@/components/communities/threads/crosspost-switch";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";

export function CommunityThreads({ community, threads: initialThreads }: { community: Community; threads: Thread[] }) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  // Unified pagination state
  const [page, setPage] = useState(1); // DB pagination
  const [nextCursor, setNextCursor] = useState<string | null>(null); // Lens pagination
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  // Unified hasPrev/hasNext logic
  const hasPrev = showAllPosts ? !!prevCursor : page > 1;
  const hasNext = showAllPosts ? !!nextCursor : threads.length === THREADS_PER_PAGE;

  // Unified page/cursor change handler
  const handlePageChange = async (direction: "next" | "prev") => {
    setLoadingPage(true);
    let result;
    if (showAllPosts) {
      // Lens cursor-based pagination
      const cursorToUse = direction === "next" ? nextCursor : prevCursor;
      if (!cursorToUse) {
        setLoadingPage(false);
        return;
      }
      result = await getCommunityThreads(community, {
        limit: THREADS_PER_PAGE,
        showAllPosts: true,
        cursor: cursorToUse,
      });
      setNextCursor(result.nextCursor ?? null);
      setPrevCursor(result.prevCursor ?? null);
    } else {
      // DB offset-based pagination
      const newPage = direction === "next" ? page + 1 : page - 1;
      setPage(newPage);
      result = await getCommunityThreads(community, {
        limit: THREADS_PER_PAGE,
        offset: (newPage - 1) * THREADS_PER_PAGE,
        showAllPosts: false,
      });
    }
    setThreads(result.success ? (result.threads ?? []) : []);
    setLoadingPage(false);
  };

  // Toggle between Lens and DB threads
  const handleToggleShowAllPosts = async () => {
    setLoadingPage(true);
    const newValue = !showAllPosts;
    setShowAllPosts(newValue);
    setPage(1);
    setNextCursor(null);
    setPrevCursor(null);
    const result = await getCommunityThreads(community, {
      limit: THREADS_PER_PAGE,
      showAllPosts: newValue,
    });
    setThreads(result.success ? (result.threads ?? []) : []);
    setNextCursor(result.nextCursor ?? null);
    setPrevCursor(result.prevCursor ?? null);
    setLoadingPage(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <CommunityNavActions community={community} />
          <CommunityHeader community={community} />
          <CrosspostSwitch checked={showAllPosts} onCheckedChange={handleToggleShowAllPosts} />
          {loadingPage ? (
            <div className="flex w-full items-center justify-center py-12">
              <LoadingSpinner text="Loading threads..." />
            </div>
          ) : (
            <CommunityThreadsList threads={threads} />
          )}
          <Pagination
            onPrev={() => handlePageChange("prev")}
            onNext={() => handlePageChange("next")}
            hasPrev={hasPrev}
            hasNext={hasNext}
            loading={loadingPage}
          />
        </div>
        <div className="space-y-8 lg:pt-[54px]">
          <CommunitySidebar community={community} />
        </div>
      </div>
    </main>
  );
}
