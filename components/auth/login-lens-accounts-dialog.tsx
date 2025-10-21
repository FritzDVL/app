"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { client } from "@/lib/external/lens/protocol-client";
import { HEY_URL } from "@/lib/shared/constants";
import { Address } from "@/types/common";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { AccountAvailable, evmAddress } from "@lens-protocol/react";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";

interface LensAccountsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountSelect: (account: AccountAvailable) => Promise<void>;
  loadingAccount: string | null; // address de la cuenta que está en loading
  title?: string;
  description?: string;
  buttonText?: string;
}

export function LensAccountsDialog({
  isOpen,
  onClose,
  onAccountSelect,
  loadingAccount,
  title = "Connect your Lens account",
  description = "Select a Lens account to continue",
  buttonText = "Connect",
}: LensAccountsDialogProps) {
  const [lensAccounts, setLensAccounts] = useState<AccountAvailable[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

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

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="border-0 bg-white shadow-lg backdrop-blur-md dark:border-gray-600/60 dark:bg-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingAccounts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : lensAccounts.length === 0 ? (
            <div className="py-6 text-center">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-gray-700/60 dark:bg-gray-800/80">
                <p className="font-medium text-foreground">No Lens accounts found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No Lens accounts associated with your wallet were found.
                </p>
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
              <div className="rounded-lg border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/50 p-3 dark:border-brand-700/50 dark:from-brand-900/30 dark:to-brand-900/20">
                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                  {lensAccounts.length} account{lensAccounts.length === 1 ? "" : "s"} found
                </p>
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Choose an account to continue with Society Protocol Forum
                </p>
              </div>
              <div className="max-h-[350px] space-y-2 overflow-y-auto">
                {lensAccounts.map(lensAccount => (
                  <div
                    key={lensAccount.account.address}
                    className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white/90 p-3 shadow-sm transition-all duration-200 hover:border-brand-200 hover:bg-white hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/90 dark:hover:border-brand-700/50 dark:hover:bg-gray-800"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-brand-200 transition-all group-hover:ring-brand-300">
                        {lensAccount.account.metadata?.picture ? (
                          <Image
                            src={lensAccount.account.metadata.picture}
                            alt={lensAccount.account.username?.value || "Lens Account"}
                            className="rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-200 to-brand-400 text-lg font-semibold text-white">
                            {lensAccount.account.username?.value?.[5]?.toUpperCase() || "?"}
                          </span>
                        )}
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900 dark:text-gray-100">
                          {lensAccount?.account?.metadata?.name || lensAccount.account.username?.value}
                        </p>
                        <p className="truncate text-sm text-slate-600 dark:text-gray-400">
                          @{lensAccount.account.username?.value}
                        </p>
                        {lensAccount.account.metadata?.bio && (
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-gray-500">
                            {lensAccount.account.metadata.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="ml-3 shrink-0 bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white hover:from-brand-600 hover:to-brand-700"
                      onClick={() => onAccountSelect(lensAccount)}
                      disabled={loadingAccount === lensAccount.account.address}
                    >
                      {loadingAccount === lensAccount.account.address ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          {buttonText}ing...
                        </div>
                      ) : (
                        buttonText
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
