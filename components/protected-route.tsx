"use client";

import { NFTRequiredDialog } from "@/components/nft-required-dialog";
import { useLensReputationNFT } from "@/hooks/use-lensreputation-nft";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for protecting routes that require NFT ownership
 * Can be used to wrap entire pages or specific components
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { hasNFT, isLoading, error } = useLensReputationNFT();

  if (isLoading) {
    return null;
  }
  if (error) {
    return <div className="py-8 text-center text-red-500">Error checking NFT: {error}</div>;
  }
  if (!hasNFT) {
    return <NFTRequiredDialog open={true} />;
  }

  return <>{children}</>;
}
