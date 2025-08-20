import { useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export function useIsOwner(community: Community) {
  const [isOwner, setIsOwner] = useState(false);

  const { walletAddress } = useAuthStore();

  useEffect(() => {
    const userIsOwner = walletAddress == community.owner;
    setIsOwner(userIsOwner);
  }, [walletAddress, community.moderators]);

  return isOwner;
}
