import { useEffect, useState } from "react";
import { transformCommunityToDetails } from "@/lib/transformers/community-transformers";
import { useCommunitiesStore } from "@/stores/communities-store";
import { CommunityDetails } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchGroup } from "@lens-protocol/client/actions";
import { useSessionClient } from "@lens-protocol/react";

export function useCommunityDetails(communityId: string) {
  const sessionClient = useSessionClient();
  const { getCommunityById, isLoading, error } = useCommunitiesStore();

  const [communityDetails, setCommunityDetails] = useState<CommunityDetails | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommunityDetails = async () => {
      if (!communityId) return;

      try {
        setLocalLoading(true);
        setLocalError(null);

        // Get community (will auto-fetch if needed)
        const community = await getCommunityById(communityId);

        if (!community) {
          throw new Error("Community not found");
        }

        // Get membership status if user is logged in
        let userIsMember = false;
        if (sessionClient.data) {
          try {
            const groupResult = await fetchGroup(sessionClient.data, {
              group: evmAddress(communityId),
            });

            if (groupResult.isOk() && groupResult.value) {
              userIsMember = groupResult.value.operations?.isMember || false;
            }
          } catch (membershipError) {
            console.warn("Could not check membership status:", membershipError);
          }
        }

        // Transform to CommunityDetails format
        const details = transformCommunityToDetails(community, userIsMember, false);

        setCommunityDetails(details);
        setIsJoined(userIsMember);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setLocalError(errorMessage);
        console.error("Error loading community details:", err);
      } finally {
        setLocalLoading(false);
      }
    };

    loadCommunityDetails();
  }, [communityId, sessionClient.data, getCommunityById]);

  return {
    communityDetails,
    isJoined,
    setIsJoined,
    isLoading: localLoading || isLoading,
    error: localError || error,
  };
}
