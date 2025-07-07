"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginLensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { ConnectKitButton } from "connectkit";
import { ChevronDown, Loader2, LogOut, User, Wallet } from "lucide-react";

export function LoginConnectButton() {
  const [showLensDialog, setShowLensDialog] = useState(false);

  const { isLoading: isAuthLoading, account } = useAuthStore();
  const { logout } = useLogout();

  return (
    <>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          if (isConnected && account) {
            return (
              <div className="flex w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-center gap-2 rounded-full transition-all duration-200 hover:bg-white/20"
                    >
                      <Image
                        src={account.metadata?.picture || "/placeholder-user.jpg"}
                        alt="Lens Profile"
                        className="h-5 w-5 rounded-full"
                      />
                      <span className="truncate">@{account.username?.localName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="gradient-card w-[200px] border-white/20">
                    <DropdownMenuItem
                      onClick={() => {
                        setShowLensDialog(true);
                      }}
                      className="cursor-pointer hover:bg-white/20"
                    >
                      <User className="mr-2 h-4 w-4 text-brand-500" />
                      Change profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-white/20">
                      <LogOut className="mr-2 h-4 w-4 text-brand-500" />
                      Disconnect from Lens
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }

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
