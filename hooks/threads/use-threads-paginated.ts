import { useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";

interface UseThreadsPaginatedProps {
  community: Community;
  initialThreads: Thread[];
}

export function useThreadsPaginated({
  community,
  initialThreads,
}: Omit<UseThreadsPaginatedProps, "initialCrosspostEnabled">) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // DB pagination

  const hasPrev = page > 1;
  const hasNext = threads.length === THREADS_PER_PAGE;

  const handlePageChange = async (direction: "next" | "prev") => {
    setLoading(true);
    const newPage = direction === "next" ? page + 1 : page - 1;
    setPage(newPage);

    const result = await getCommunityThreads(community, {
      limit: THREADS_PER_PAGE,
      offset: (newPage - 1) * THREADS_PER_PAGE,
      showAllPosts: false,
    });

    setThreads(result.success ? (result.threads ?? []) : []);
    setLoading(false);
  };

  return {
    threads,
    loading,
    next: () => handlePageChange("next"),
    prev: () => handlePageChange("prev"),
    hasNext,
    hasPrev,
  };
}
