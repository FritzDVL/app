"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { Address } from "@/types/common";
import { User } from "lucide-react";

interface CommunityOwnerProps {
  owner: Address | { address: string; displayName?: string; username?: string; picture?: string };
}

export function CommunityOwner({ owner }: CommunityOwnerProps) {
  const ownerAddress = typeof owner === "string" ? owner : owner.address;
  const fallback = (typeof owner === "string" ? {} : owner) as {
    displayName?: string;
    username?: string;
    picture?: string;
  };
  const [account, setAccount] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doFetchOwner = async () => {
      try {
        const acc = await fetchAccountFromLens(ownerAddress);
        setAccount(acc);
      } catch (error) {
        console.error("Failed to fetch owner account:", error);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    doFetchOwner();
  }, [ownerAddress]);

  const displayName =
    account?.metadata?.name ||
    account?.username?.localName ||
    fallback.displayName ||
    fallback.username ||
    "Unknown Owner";
  const username = account?.username?.localName || fallback.username;
  const picture = account?.metadata?.picture || fallback.picture;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900${loading ? "animate-pulse" : ""}`}
    >
      <Avatar className="h-9 w-9">
        {picture ? (
          <AvatarImage src={picture} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{loading ? "Loading owner..." : displayName}</div>
        <div className="truncate text-xs text-muted-foreground">{username ? `@${username}` : ownerAddress}</div>
      </div>
    </div>
  );
}
