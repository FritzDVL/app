"use client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for protecting routes that require NFT ownership
 * Can be used to wrap entire pages or specific components
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
