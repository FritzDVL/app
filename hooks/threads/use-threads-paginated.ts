import { useCallback, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";

interface UseThreadsPaginatedProps {
  community: Community;
  initialThreads: Thread[];
  initialCrosspostEnabled: boolean;
}

export function useThreadsPaginated({ community, initialThreads, initialCrosspostEnabled }: UseThreadsPaginatedProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [loading, setLoading] = useState(false);
  const [crosspostEnabled, setCrosspostEnabled] = useState(initialCrosspostEnabled);
  const [page, setPage] = useState(1); // DB pagination
  const [nextCursor, setNextCursor] = useState<string | null>(null); // Lens pagination
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  const hasPrev = crosspostEnabled ? !!prevCursor : page > 1;
  const hasNext = crosspostEnabled ? !!nextCursor : threads.length === THREADS_PER_PAGE;

  // Function to fetch threads
  const fetchThreads = useCallback(
    async (showAllPosts: boolean) => {
      setLoading(true);
      try {
        const result = await getCommunityThreads(community, {
          limit: THREADS_PER_PAGE,
          showAllPosts,
          offset: showAllPosts ? undefined : 0,
        });
        setThreads(result.success ? (result.threads ?? []) : []);
        setNextCursor(result.nextCursor ?? null);
        setPrevCursor(result.prevCursor ?? null);
        setPage(1);
      } catch {
        setThreads([]);
      } finally {
        setLoading(false);
      }
    },
    [community],
  );

  // Function to toggle crosspost and fetch new data
  const toggleCrosspost = useCallback(async () => {
    const newValue = !crosspostEnabled;
    setCrosspostEnabled(newValue);

    // Persist preference in cookie
    const COOKIE_KEY = `showAllPosts:${community.id}`;
    document.cookie = `${COOKIE_KEY}=${newValue}; path=/; max-age=31536000`;

    // Fetch threads with new value
    await fetchThreads(newValue);
  }, [crosspostEnabled, community.id, fetchThreads]);

  const handlePageChange = async (direction: "next" | "prev") => {
    setLoading(true);
    let result;
    if (crosspostEnabled) {
      // Lens cursor-based pagination
      const cursorToUse = direction === "next" ? nextCursor : prevCursor;
      if (!cursorToUse) {
        setLoading(false);
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
    setLoading(false);
  };

  return {
    threads,
    loading,
    crosspostEnabled,
    toggleCrosspost,
    next: () => handlePageChange("next"),
    prev: () => handlePageChange("prev"),
    hasNext,
    hasPrev,
  };
}
