"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { enableSignless } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { X, Zap } from "lucide-react";
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
      <DialogContent className="border-0 bg-white/90 shadow-lg backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">Enable Signless Experience</DialogTitle>
          <DialogDescription className="text-slate-600">
            Enjoy a seamless Lens experience without signing every transaction. You can always change this later in your
            settings.
          </DialogDescription>
        </DialogHeader>

        {/* Feature Preview */}
        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand-500 p-2">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">Lightning Fast Actions</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Post, comment, and interact without waiting for wallet confirmations
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100/80 p-3">
            <span className="font-medium text-slate-900">Signless Mode:</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
              Currently Disabled
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-slate-200 bg-white/70 text-slate-700"
            onClick={onClose}
            disabled={isEnableLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white hover:from-brand-600 hover:to-brand-700"
            onClick={handleEnableSignless}
            disabled={isEnableLoading}
          >
            {isEnableLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Enabling...
              </div>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Enable Signless
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
