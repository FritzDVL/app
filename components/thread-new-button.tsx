"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/common";
import { PenTool } from "lucide-react";

interface ThreadNewButtonProps {
  communityAddress: Address;
  isJoined: boolean;
  className?: string;
}

export function ThreadNewButton({ communityAddress, isJoined, className = "" }: ThreadNewButtonProps) {
  const router = useRouter();

  const handleCreateThread = () => {
    if (!isJoined) {
      // Could show a toast here about needing to join first
      return;
    }

    router.push(`/communities/${communityAddress}/new-thread`);
  };

  return (
    <Button
      onClick={handleCreateThread}
      variant="ghost"
      size="sm"
      className={`text-brand-600 hover:bg-brand-50 ${className}`}
      disabled={!isJoined}
    >
      <PenTool className="mr-2 h-4 w-4" />
      New Thread
    </Button>
  );
}
