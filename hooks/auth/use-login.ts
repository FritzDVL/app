import { useCallback, useState } from "react";
import { client } from "@/lib/external/lens/protocol-client";
import { APP_ADDRESS } from "@/lib/shared/constants";
import { useAuthStore } from "@/stores/auth-store";
import { fetchAccount } from "@lens-protocol/client/actions";
import { signMessageWith } from "@lens-protocol/client/viem";
import { AccountAvailable, evmAddress, useLogin as useLensLogin } from "@lens-protocol/react";
import { useAccount, useWalletClient } from "wagmi";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAccount, walletAddress, setLensSession } = useAuthStore();

  const { status: walletStatus } = useAccount();
  const { execute: loginLens } = useLensLogin();
  const { data: walletClient } = useWalletClient();

  const login = useCallback(
    async (lensAccount: AccountAvailable, onLoginSuccess?: () => void) => {
      if (walletStatus !== "connected") {
        console.error("Wallet is not connected");
        return;
      }

      if (!walletClient) {
        console.error("Wallet client data is not available");
        return;
      }

      setIsLoading(true);
      try {
        let authenticated;
        if (lensAccount.__typename == "AccountOwned") {
          authenticated = await loginLens({
            accountOwner: {
              account: evmAddress(lensAccount.account.address),
              app: evmAddress(APP_ADDRESS),
              owner: evmAddress(walletAddress || ""),
            },
            signMessage: signMessageWith(walletClient),
          });
        } else if (lensAccount.__typename === "AccountManaged") {
          authenticated = await loginLens({
            accountManager: {
              account: evmAddress(lensAccount.account.address),
              app: evmAddress(APP_ADDRESS),
              manager: evmAddress(walletAddress || ""),
            },
            signMessage: signMessageWith(walletClient),
          });
        }
        if (!authenticated) {
          throw new Error("Authentication failed");
        }

        if (authenticated.isErr()) {
          throw new Error(`Authentication failed: ${authenticated.error.message}`);
        }

        // Set lens session
        setLensSession(authenticated.value); // TODO: Ensure authenticated.value matches AuthenticatedUser type

        // Fetch account details
        const result = await fetchAccount(client, {
          address: evmAddress(lensAccount.account.address),
        });

        if (result.isOk()) {
          setAccount(result.value);
          onLoginSuccess?.();
        } else {
          console.error("Failed to fetch account:", result.error);
          throw new Error(`Failed to fetch account: ${result.error.message}`);
        }
      } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw to allow handling in UI components
      } finally {
        setIsLoading(false);
      }
    },
    [walletStatus, walletAddress, walletClient, loginLens, setAccount, setIsLoading, setLensSession],
  );

  return {
    login,
    isLoading,
  };
}
