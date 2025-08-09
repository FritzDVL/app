import { fetchFeaturedCommunities } from "@/lib/external/supabase/communities";
import { fetchCommunity } from "@/lib/fetchers/community";
import type { Community } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export function useFeaturedCommunities() {
  return useQuery<Community[], Error>({
    queryKey: ["communities", "featured"],
    queryFn: async () => {
      const dbCommunities = await fetchFeaturedCommunities();
      const populated = await Promise.all(dbCommunities.map(c => fetchCommunity(c.lens_group_address)));
      return populated.filter(Boolean) as Community[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
