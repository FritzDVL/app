"use client";

import { useEffect, useState } from "react";
import { LoginLensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { EnableSignlessDialog } from "@/components/auth/enable-signless-dialog";
import { useSignlessStatus } from "@/hooks/common/use-signless-status";
import { useAuthStore } from "@/stores/auth-store";
import { ConnectKitProvider } from "connectkit";
import { useAccount } from "wagmi";

// Inner component that uses wagmi hooks
function ConnectMonitor() {
  const { address, isConnected } = useAccount();
  const { setWalletAddress } = useAuthStore();

  // Synchronize wallet connection state with our auth store
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    } else if (!isConnected) {
      setWalletAddress(null);
    }
  }, [isConnected, address, setWalletAddress]);

  return null;
}

// Provider component that wraps the application
export function ConnectProvider({ children }: { children: React.ReactNode }) {
  const [isLoginLensDialogOpen, setIsLoginLensDialogOpen] = useState(false);
  const [isEnableSignlessDialogOpen, setIsEnableSignlessDialogOpen] = useState(false);
  const { enabled: isSignlessEnabled, isLoading: isSignlessLoading } = useSignlessStatus();

  const { setWalletAddress, setAccount, setLensSession } = useAuthStore();

  const handleDisconnect = async () => {
    // Clear wallet address on disconnect
    setWalletAddress(null);
    setAccount(null);
    setLensSession(null);
  };

  const handleConnect = async (walletAddress: string) => {
    // When wallet connects, open the login modal to select Lens account
    setIsLoginLensDialogOpen(true);
    setWalletAddress(walletAddress);
  };

  const handleCloseLoginLensDialog = () => {
    setIsLoginLensDialogOpen(false);
    // Only open signless dialog if not already enabled and not loading
    if (!isSignlessEnabled && !isSignlessLoading) {
      setIsEnableSignlessDialogOpen(true);
    }
  };

  const handleCloseEnableSignlessDialog = () => {
    setIsEnableSignlessDialogOpen(false);
  };

  return (
    <ConnectKitProvider onConnect={({ address }) => handleConnect(address ?? "")} onDisconnect={handleDisconnect}>
      <ConnectMonitor />
      <LoginLensAccountsDialog isOpen={isLoginLensDialogOpen} onClose={handleCloseLoginLensDialog} />
      <EnableSignlessDialog isOpen={isEnableSignlessDialogOpen} onClose={handleCloseEnableSignlessDialog} />
      {children}
    </ConnectKitProvider>
  );
}
