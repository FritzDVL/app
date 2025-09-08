"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { CommunitySidebar } from "@/components/communities/display/community-sidebar";
import { CommunityThreadsList } from "@/components/communities/threads/community-threads-list";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";

export function CommunityThreads({
  community,
  threads: initialThreads,
  page: initialPage = 1,
  limit = 10,
}: {
  community: Community;
  threads: Thread[];
  page?: number;
  limit?: number;
}) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [page, setPage] = useState(initialPage);
  const router = useRouter();
  const hasPrev = page > 1;
  const hasNext = threads.length === limit;

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    router.replace(`?page=${newPage}`);
    // Fetch threads client-side using the new function signature
    const result = await getCommunityThreads(community, { limit, offset: (newPage - 1) * limit });
    setThreads(result.success ? (result.threads ?? []) : []);
  };

  const prevPageUrl = hasPrev ? `?page=${page - 1}` : undefined;
  const nextPageUrl = hasNext ? `?page=${page + 1}` : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <CommunityNavActions community={community} />
          <CommunityHeader community={community} />
          <CommunityThreadsList threads={threads} />
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={prevPageUrl}
                    className={!hasPrev ? "pointer-events-none opacity-50" : ""}
                    onClick={e => {
                      e.preventDefault();
                      if (hasPrev) handlePageChange(page - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href={nextPageUrl}
                    className={!hasNext ? "pointer-events-none opacity-50" : ""}
                    onClick={e => {
                      e.preventDefault();
                      if (hasNext) handlePageChange(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        <div className="space-y-8 lg:pt-[54px]">
          <CommunitySidebar community={community} />
        </div>
      </div>
    </main>
  );
}
