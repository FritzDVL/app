"use client";

import { useState } from "react";
import { LensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/use-login";
import { useAuthStore } from "@/stores/auth-store";
import { AccountAvailable } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { Loader2, Wallet } from "lucide-react";

export function LoginConnectButton() {
  const [showLensDialog, setShowLensDialog] = useState(false);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  const { isLoading: isAuthLoading, account } = useAuthStore();
  const { login } = useLogin();

  const handleLogin = async (lensAccount: AccountAvailable) => {
    setLoggingIn(lensAccount.account.address);
    try {
      await login(lensAccount, () => {
        setShowLensDialog(false);
      });
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoggingIn(null);
    }
  };

  return (
    <>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          if (isConnected && !account) {
            return (
              <Button
                className="gradient-button gap-2 rounded-full px-4 py-2"
                onClick={() => setShowLensDialog(true)}
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading profiles...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect with Lens
                  </>
                )}
              </Button>
            );
          }

          return (
            <Button onClick={show} className="gradient-button w-full gap-2 rounded-full px-4 py-2">
              <Wallet className="h-4 w-4" />
              {isConnected
                ? ensName || `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`
                : isConnecting
                  ? "Connecting..."
                  : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectKitButton.Custom>

      <LensAccountsDialog
        isOpen={showLensDialog}
        onClose={() => setShowLensDialog(false)}
        onAccountSelect={handleLogin}
        loadingAccount={loggingIn}
        title="Connect your Lens account"
        description="Select a Lens account to continue"
        buttonText="Connect"
      />
    </>
  );
}
