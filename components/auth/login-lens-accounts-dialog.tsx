"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLogin } from "@/hooks/auth/use-login";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { HEY_URL } from "@/lib/constants";
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
  const [loggingIn, setLoggingIn] = useState<AccountAvailable | null>(null);
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

  const handleLogin = async (lensAccount: AccountAvailable) => {
    setLoggingIn(lensAccount);
    try {
      await login(lensAccount, () => {
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
      <DialogContent className="border-0 bg-white/90 shadow-lg backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">Connect your Lens account</DialogTitle>
          <DialogDescription className="text-slate-600">Select a Lens account to continue</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingAccounts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : lensAccounts.length === 0 ? (
            <div className="py-6 text-center">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="font-medium text-slate-900">No Lens accounts found</p>
                <p className="mt-1 text-sm text-slate-600">No Lens accounts associated with your wallet were found.</p>
                <div className="mt-4">
                  <a
                    href={HEY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700"
                  >
                    Create an Account on Hey
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/50 p-3">
                <p className="text-sm font-medium text-slate-900">
                  {lensAccounts.length} account{lensAccounts.length === 1 ? "" : "s"} found
                </p>
                <p className="text-xs text-slate-600">Choose an account to continue with LensForum</p>
              </div>
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {lensAccounts.map(lensAccount => (
                  <div
                    key={lensAccount.account.address}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/90 p-3 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-brand-200">
                        {lensAccount.account.metadata?.picture ? (
                          <Image
                            src={lensAccount.account.metadata.picture}
                            alt={lensAccount.account.username?.value || "Lens Account"}
                            className="rounded-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-200 to-brand-400 text-lg font-semibold text-white">
                            {lensAccount.account.username?.value?.[5]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{lensAccount?.account?.metadata?.name}</p>
                        <p className="text-sm text-slate-600">@{lensAccount.account.username?.value}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white hover:from-brand-600 hover:to-brand-700"
                      onClick={() => handleLogin(lensAccount)}
                      disabled={loggingIn === lensAccount.account.address}
                    >
                      {loggingIn === lensAccount.account.address ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          Connecting...
                        </div>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
