"use client";

import { useState } from "react";
import { LensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/use-login";
import { useAuthStore } from "@/stores/auth-store";
import { AccountAvailable } from "@lens-protocol/react";
import { ConnectKitButton } from "connectkit";
import { Loader2, LogIn, UserPlus, Wallet } from "lucide-react";

interface LoginConnectButtonProps {
  variant?: "default" | "compact";
  showLabels?: boolean;
}

export function LoginConnectButton({ variant = "default", showLabels = true }: LoginConnectButtonProps) {
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

  const isCompact = variant === "compact";

  return (
    <>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          if (isConnected && !account) {
            return (
              <Button
                className={`${isCompact ? "h-8 gap-1 px-3 text-sm" : "gap-2 px-4 py-2"} gradient-button rounded-full`}
                onClick={() => setShowLensDialog(true)}
                disabled={isAuthLoading}
                size={isCompact ? "sm" : "default"}
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} animate-spin`} />
                    {showLabels && (isCompact ? "Loading..." : "Loading profiles...")}
                  </>
                ) : (
                  <>
                    <LogIn className={`${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                    {showLabels && (isCompact ? "Sign In" : "Connect with Lens")}
                  </>
                )}
              </Button>
            );
          }

          return (
            <div className={`flex ${isCompact ? "gap-1" : "gap-2"}`}>
              <Button
                onClick={show}
                className={`${isCompact ? "h-8 gap-1 px-3 text-sm" : "gap-2 px-4 py-2"} gradient-button rounded-full`}
                size={isCompact ? "sm" : "default"}
              >
                <Wallet className={`${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
                {isConnected
                  ? showLabels
                    ? ensName || `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`
                    : ""
                  : isConnecting
                    ? showLabels
                      ? "Connecting..."
                      : ""
                    : showLabels
                      ? isCompact
                        ? "Connect"
                        : "Connect Wallet"
                      : ""}
              </Button>

              {isCompact && !isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-full border-brand-200 px-3 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20"
                  onClick={() => {
                    // For now, same as connect - in a real app this might go to a registration flow
                    show?.();
                  }}
                >
                  <UserPlus className="h-3 w-3" />
                  {showLabels && "Register"}
                </Button>
              )}
            </div>
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
