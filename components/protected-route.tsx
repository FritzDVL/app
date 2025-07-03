"use client";

import { NFTRequiredDialog } from "@/components/nft-required-dialog";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// MOCK useNFTVerification for testing: always returns not loading and hasNFT false
function useNFTVerificationMock() {
  return { hasNFT: false, isLoading: false };
}

/**
 * Wrapper component for protecting routes that require NFT ownership
 * Can be used to wrap entire pages or specific components
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Always show the required dialog for this simplified version
  return <NFTRequiredDialog open={true} />;
}
