import { useMemo } from "react";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export function useIsModerator(community: Community): boolean {
  const { account } = useAuthStore();

  return useMemo(() => {
    if (!account) {
      return false;
    }

    return community.moderators.some(mod => mod.address.toLowerCase() === account.address.toLowerCase());
  }, [account, community.moderators]);
}
