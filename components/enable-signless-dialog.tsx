"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { enableSignless } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { Loader2 } from "lucide-react";
import { useWalletClient } from "wagmi";

interface EnableSignlessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnableSignlessDialog({ isOpen, onClose }: EnableSignlessDialogProps) {
  const [isEnableLoading, setIsEnableLoading] = useState(false);
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const handleEnableSignless = async () => {
    if (!sessionClient || !sessionClient.data) {
      console.warn("Session client not available, cannot enable signless");
      return;
    }
    setIsEnableLoading(true);

    const result = await enableSignless(sessionClient.data).andThen(handleOperationWith(walletClient.data));

    if (result.isErr()) {
      setIsEnableLoading(false);
      return console.error(result.error);
    }
    setIsEnableLoading(false);
    const session = result.value;
    console.log("Signless enabled successfully:", session);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="border-0 bg-white/80 shadow-xl backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Enable Signless Experience</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enjoy a seamless Lens experience without signing every transaction. You can always change this later in your
            settings.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900">Signless Mode</span>
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">Disabled</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-white shadow-sm hover:from-brand-600 hover:to-brand-700"
              onClick={handleEnableSignless}
              disabled={isEnableLoading}
            >
              {isEnableLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enable Signless
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-gray-300 px-4 py-2 text-gray-700"
              onClick={onClose}
              disabled={isEnableLoading}
            >
              Continue without signless
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
