import { ADMIN_USER_ADDRESS } from "@/lib/shared/constants";
import { useAuthStore } from "@/stores/auth-store";

export function useIsAdmin(): boolean {
  const { walletAddress } = useAuthStore();
  // Compare addresses case-insensitively
  return typeof walletAddress === "string" && walletAddress.toLowerCase() === ADMIN_USER_ADDRESS.toLowerCase();
}
