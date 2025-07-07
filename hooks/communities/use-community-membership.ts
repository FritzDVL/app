import { useEffect, useState } from "react";
import { evmAddress } from "@lens-protocol/client";
import { fetchGroup } from "@lens-protocol/client/actions";
import { useSessionClient } from "@lens-protocol/react";

/**
 * Custom hook to check if the logged-in user is a member of a community.
 * @param communityId - The Lens Protocol group address
 * @returns { isMember, isLoading, error }
 */
export const useCommunityMembership = (address: string) => {
  const sessionClient = useSessionClient();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const checkMembership = async () => {
      setIsLoading(true);
      setError(null);
      let userIsMember = false;
      if (sessionClient.data) {
        try {
          const groupResult = await fetchGroup(sessionClient.data, {
            group: evmAddress(address),
          });
          if (groupResult.isOk() && groupResult.value) {
            userIsMember = groupResult.value.operations?.isMember || false;
          }
        } catch (membershipError) {
          if (!cancelled) {
            setError("Could not check membership status");
            console.warn("Could not check membership status:", membershipError);
          }
        }
      }
      if (!cancelled) {
        setIsMember(userIsMember);
        setIsLoading(false);
      }
    };
    checkMembership();
    return () => {
      cancelled = true;
    };
  }, [address, sessionClient.data]);

  // Allow external update of isMember
  const updateIsMember = (value: boolean) => setIsMember(value);

  return { isMember, isLoading, error, updateIsMember };
};
