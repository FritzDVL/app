import { useCallback, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout as useLensLogout } from "@lens-protocol/react";
import { useDisconnect } from "wagmi";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const { setAccount, setLensSession, account } = useAuthStore();

  const { disconnect } = useDisconnect();
  const { execute: logoutLens } = useLensLogout();

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      // Disconnect wallet
      disconnect();

      // Logout from Lens if we have an account
      if (account) {
        logoutLens();
      }

      // Reset auth state
      setAccount(null);
      setLensSession(null);
    } catch (error) {
      console.error("Error during logout process:", error);
      throw error; // Re-throw to allow handling in UI components
    } finally {
      setIsLoading(false);
    }
  }, [account, disconnect, logoutLens, setAccount, setIsLoading, setLensSession]);

  return {
    logout,
    isLoading,
  };
}
