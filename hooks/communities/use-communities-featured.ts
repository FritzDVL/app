import { useEffect, useState } from "react";
import { getFeaturedCommunities } from "@/lib/services/community/get-featured-communities";
import { Community } from "@/lib/domain/communities/types";

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
        const result = await getFeaturedCommunities();
        if (isMounted) {
          if (result.success) {
            setFeatured(result.communities || []);
          } else {
            console.error("Failed to fetch featured communities:", result.error);
            setFeatured([]);
          }
        }
      } catch (error) {
        console.error("Error fetching featured communities:", error);
        if (isMounted) {
          setFeatured([]);
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
