import { useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { fetchAdminsFromGroup } from "@/lib/external/lens/primitives/admins";
import { useAuthStore } from "@/stores/auth-store";

export function useIsModerator(community: Community): { isModerator: boolean; isLoading: boolean } {
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { account } = useAuthStore();

  useEffect(() => {
    let cancelled = false;
    const checkModerator = async () => {
      setIsLoading(true);
      if (!account) {
        setIsModerator(false);
        setIsLoading(false);
        return;
      }
      // Owner is always moderator
      if (account.address === community.group.owner) {
        setIsModerator(true);
        setIsLoading(false);
        return;
      }
      try {
        const admins = await fetchAdminsFromGroup(community.group.address);
        if (!cancelled) {
          setIsModerator(admins.some(admin => admin.account.address === account.address));
        }
      } catch {
        if (!cancelled) setIsModerator(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    checkModerator();
    return () => {
      cancelled = true;
    };
  }, [account, community.group.address, community.group.owner]);

  return { isModerator, isLoading };
}
