"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchAccountFromLens } from "@/lib/external/lens/primitives/accounts";
import { compactAddress } from "@/lib/shared/utils";
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

  const displayName = account?.metadata?.name || "Wallet";
  const username = account?.username?.localName;
  const picture = account?.metadata?.picture;

  return (
    <Card className="motion-preset-fade-in rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader>
        <h3 className="text-lg font-semibold">Owner</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
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
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {loading ? (
                <span className="inline-block h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : (
                displayName
              )}
            </span>
            <span className="truncate text-xs text-gray-500">
              {loading ? (
                <span className="inline-block h-3 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              ) : username ? (
                <Link href={`/u/${username}`}>@{username}</Link>
              ) : (
                compactAddress(owner)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
