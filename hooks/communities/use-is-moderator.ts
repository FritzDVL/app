import { useMemo } from "react";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export function useIsModerator(community: Community): boolean {
  const { account } = useAuthStore();

  return useMemo(() => {
    if (!account) {
      return false;
    }

    return account.address === community.group.owner;
  }, [account, community.group.owner]);
}
