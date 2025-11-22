"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Account } from "@lens-protocol/react";
import { Terminal } from "lucide-react";

export function DevLoginButton() {
  const { setAccount, setWalletAddress, setLensSession } = useAuthStore();

  const handleDevLogin = () => {
    const mockAccount: Account = {
      address: "0x1234567890123456789012345678901234567890",
      username: {
        localName: "dev_user",
        value: "lens/dev_user",
      },
      metadata: {
        name: "Dev User",
        picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev_user",
        bio: "I am a mock user for development.",
      },
    } as any; // Casting as any because Account type might have more fields

    setAccount(mockAccount);
    setWalletAddress("0x1234567890123456789012345678901234567890");
    setLensSession({
      accessToken: "mock_token",
      refreshToken: "mock_refresh_token",
      identityToken: "mock_identity_token",
    } as any);
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDevLogin}
      className="border-dashed border-yellow-500 text-yellow-600 hover:bg-yellow-50"
    >
      <Terminal className="mr-2 h-4 w-4" />
      Dev Login
    </Button>
  );
}
