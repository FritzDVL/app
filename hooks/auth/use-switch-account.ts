import { useCallback, useState } from "react";
import { client } from "@/lib/external/lens/protocol-client";
import { useAuthStore } from "@/stores/auth-store";
import { fetchAccount } from "@lens-protocol/client/actions";
import { evmAddress, useSwitchAccount as useSwitchAccountLens } from "@lens-protocol/react";
import { AccountAvailable } from "@lens-protocol/react";

export function useSwitchAccount() {
  const [isLoading, setIsLoading] = useState(false);

  const { setAccount, setLensSession } = useAuthStore();
  const { execute: switchAccountLens } = useSwitchAccountLens();

  const switchLensAccount = useCallback(
    async (lensAccount: AccountAvailable, onSwitchSuccess?: () => void) => {
      setIsLoading(true);
      try {
        // Switch account in Lens
        const result = await switchAccountLens({ account: evmAddress(lensAccount.account.address) });
        if (!result) {
          throw new Error("Switch account failed: No result returned");
        }
        if (result.isErr()) {
          throw new Error(result.error?.message || "Switch account failed");
        }
        // Set lens session (AuthenticatedUser)
        setLensSession(result.value);
        // Fetch the full Account object for the new address
        const accountResult = await fetchAccount(client, {
          address: evmAddress(lensAccount.account.address),
        });
        if (accountResult.isErr()) {
          throw new Error(accountResult.error?.message || "Failed to fetch account after switch");
        }
        setAccount(accountResult.value);
        onSwitchSuccess?.();
      } catch (error) {
        console.error("Error switching account:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [switchAccountLens, setAccount, setLensSession],
  );

  return {
    switchLensAccount,
    isLoading,
  };
}
