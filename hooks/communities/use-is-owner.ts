import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export function useIsOwner(community: Community) {
  const { walletAddress } = useAuthStore();
  
  const isOwner = walletAddress === community.owner;

  return { isOwner };
}
