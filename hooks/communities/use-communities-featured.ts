import { useEffect, useState } from "react";
import { fetchFeaturedCommunities } from "@/lib/external/supabase/communities";
import { fetchCommunity } from "@/lib/fetchers/community";
import { Community } from "@/types/common";

/**
 * Returns the featured communities (3 oldest, fully populated) and a loading flag.
 */
export function useCommunitiesFeatured() {
  const [featured, setFeatured] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAndPopulate = async () => {
      setIsLoading(true);
      try {
        const dbCommunities = await fetchFeaturedCommunities();
        const populated = await Promise.all(dbCommunities.map(c => fetchCommunity(c.lens_group_address)));
        if (isMounted) {
          setFeatured(populated.filter(Boolean) as Community[]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAndPopulate();
    return () => {
      isMounted = false;
    };
  }, []);

  return { featured, isLoading };
}
