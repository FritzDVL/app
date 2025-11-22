import { useCallback, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout as useLensLogout } from "@lens-protocol/react";
import { useDisconnect } from "wagmi";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const { setAccount, setLensSession, account } = useAuthStore();

  const { disconnect } = useDisconnect();
  const { execute: logoutLens } = useLensLogout();

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Disconnect wallet
      disconnect();

      // Logout from Lens if we have an account
      if (account) {
        try {
          await logoutLens();
        } catch (e) {
          console.warn("Lens logout failed or skipped (expected in dev mode):", e);
        }
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
