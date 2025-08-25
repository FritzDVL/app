"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { Address } from "@/types/common";
import { Account } from "@lens-protocol/client";
import { User } from "lucide-react";

interface CommunityOwnerProps {
  owner: Address;
}

export function CommunityOwner({ owner }: CommunityOwnerProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doFetchOwner = async () => {
      try {
        const acc = await fetchAccountFromLens(owner);
        setAccount(acc);
      } catch (error) {
        console.error("Failed to fetch owner account:", error);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    doFetchOwner();
  }, [owner]);

  const displayName = account?.metadata?.name || "User";
  const username = account?.username?.value;
  const picture = account?.metadata?.picture;

  return (
    <div
      className={
        `flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 ` +
        (loading ? "animate-pulse" : "")
      }
      aria-busy={loading}
    >
      <Avatar className="h-9 w-9">
        {/* Always show fallback avatar while loading */}
        {loading ? (
          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
            <User className="h-5 w-5 animate-pulse" />
          </AvatarFallback>
        ) : picture ? (
          <AvatarImage src={picture} alt={displayName} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {loading ? (
            <span className="inline-block h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ) : (
            displayName
          )}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {loading ? (
            <span className="inline-block h-3 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          ) : username ? (
            `@${username}`
          ) : (
            owner
          )}
        </div>
      </div>
    </div>
  );
}
