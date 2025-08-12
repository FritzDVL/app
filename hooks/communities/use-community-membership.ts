import { useEffect, useState } from "react";
import { checkCommunityMembership } from "@/lib/services/membership/check-community-membership";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";

/**
 * Custom hook to check if the logged-in user is a member of a community.
 * @param address - The Lens Protocol group address
 * @returns { isMember, isLoading, updateIsMember }
 */
export const useCommunityMembership = (address: string) => {
  const sessionClient = useSessionClient();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkMembership = async () => {
      const currentSessionClient = sessionClient.data;
      if (!currentSessionClient) {
        if (!cancelled) {
          setIsMember(false);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      const result = await checkCommunityMembership(address, currentSessionClient);

      if (!cancelled) {
        if (result.success) {
          setIsMember(result.isMember || false);
        } else {
          toast.error("Membership check failed", {
            description: result.error || "Could not check membership status",
          });
          setIsMember(false);
        }
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

  return { isMember, isLoading, updateIsMember };
};
