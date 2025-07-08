import { fetchThread } from "@/lib/fetchers/thread";
import { useQuery } from "@tanstack/react-query";

export function useThread(threadAddress: string | undefined) {
  return useQuery({
    queryKey: ["thread", threadAddress],
    queryFn: () => fetchThread(String(threadAddress)),
    enabled: !!threadAddress,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
