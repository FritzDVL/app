import { useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export function useIsOwner(community: Community) {
  const [isOwner, setIsOwner] = useState(false);

  const { account } = useAuthStore();

  useEffect(() => {
    if (account?.address) {
      const userIsOwner = account.address == community.owner;
      setIsOwner(userIsOwner);
    }
  }, [account?.address, community.moderators]);

  return isOwner;
}
