"use client";

import { useState } from "react";
import { LoginLensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { ConnectKitButton } from "connectkit";
import { Loader2, Wallet } from "lucide-react";

export function LoginConnectButton() {
  const [showLensDialog, setShowLensDialog] = useState(false);

  const { isLoading: isAuthLoading, account } = useAuthStore();

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
            <Button onClick={show} className="gradient-button gap-2 rounded-full px-4 py-2">
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

      <LoginLensAccountsDialog isOpen={showLensDialog} onClose={() => setShowLensDialog(false)} />
    </>
  );
}
