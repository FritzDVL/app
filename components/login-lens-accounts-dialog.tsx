"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLogin } from "@/hooks/use-login";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { Address } from "@/types/common";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { AccountAvailable, evmAddress } from "@lens-protocol/react";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";

interface LoginLensAccountsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginLensAccountsDialog({ isOpen, onClose }: LoginLensAccountsDialogProps) {
  const [loggingIn, setLoggingIn] = useState<string | null>(null);
  const [lensAccounts, setLensAccounts] = useState<AccountAvailable[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const { login } = useLogin();
  const { status, address } = useAccount();

  useEffect(() => {
    const fetchLensAccounts = async (address: Address) => {
      setIsLoadingAccounts(true);
      try {
        const result = await fetchAccountsAvailable(client, {
          managedBy: evmAddress(address),
          includeOwned: true,
        });
        if (result.isOk()) {
          setLensAccounts(result.value.items.filter((account: AccountAvailable) => account !== undefined));
        }
      } catch (error) {
        console.error("Error fetching Lens accounts:", error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (status === "connected" && address) {
      fetchLensAccounts(address);
    }
  }, [status, address]);

  const handleLogin = async (lensAcc: string) => {
    setLoggingIn(lensAcc);
    try {
      await login(lensAcc, () => {
        onClose();
      });
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoggingIn(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="border-0 bg-white/80 shadow-xl backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Connect your Lens account</DialogTitle>
          <DialogDescription className="text-gray-600">Select a Lens profile to continue</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingAccounts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : lensAccounts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-600">No Lens profiles associated with your wallet were found.</p>
              <p className="mt-2">
                <a
                  href="https://hey.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline transition-colors hover:text-brand-700"
                >
                  Create a profile on Lens
                </a>
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {lensAccounts.map(lensAccount => (
                <div
                  key={lensAccount.account.address}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/90 p-3 shadow-sm transition-all duration-200 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-brand-200">
                      <Image
                        src={lensAccount.account.metadata?.picture || "/placeholder-user.jpg"}
                        alt={lensAccount.account.username?.value || "Lens Profile"}
                        className="rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{lensAccount?.account?.metadata?.name}</p>
                      <p className="text-sm text-gray-600">@{lensAccount.account.username?.value}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-white shadow-sm hover:from-brand-600 hover:to-brand-700"
                    onClick={() => handleLogin(lensAccount.account.address)}
                    disabled={loggingIn === lensAccount.account.address}
                  >
                    {loggingIn === lensAccount.account.address ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Login
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
