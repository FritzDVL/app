"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Star, Users, Zap } from "lucide-react";

interface NFTRequiredDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function NFTRequiredDialog({ open, onClose }: NFTRequiredDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMintClick = () => {
    setLoading(true);
    // Redirect to external minting page
    window.open("https://lensreputation.xyz", "_blank");
    setLoading(false);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v && onClose) onClose();
      }}
    >
      <DialogContent className="border-0 bg-white/95 shadow-xl backdrop-blur-md sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">Exclusive to LensReputation minters!</DialogTitle>
          <DialogDescription className="text-slate-600">
            To participate in the LensForum test phase you need to mint the <b>LensReputation</b> NFT.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Why mint LensReputation?</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-brand-50/80 p-3">
                <Users className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-medium text-slate-700">Access to exclusive communities and features</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-brand-50/80 p-3">
                <Star className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-medium text-slate-700">
                  Be part of LensForum&apos;s evolution from the very beginning
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-brand-50/80 p-3">
                <Zap className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-medium text-slate-700">
                  Your <b>LensReputation score</b> will play a key role in the platform&apos;s future
                </span>
              </div>
            </div>
          </div>

          {/* Main action */}
          <div className="flex flex-col gap-3">
            <Button
              className="bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white hover:from-brand-600 hover:to-brand-700"
              onClick={handleMintClick}
              disabled={loading}
            >
              {loading ? "Opening mint page..." : "Mint LensReputation NFT"}
            </Button>
            <Button
              variant="outline"
              onClick={handleBackHome}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Back to Home
            </Button>
          </div>

          {/* Note */}
          <p className="text-center text-xs text-slate-500">
            Don&apos;t have a wallet? Connect with MetaMask, WalletConnect or other supported wallets.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
