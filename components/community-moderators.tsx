"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { Moderator } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor } from "@lens-protocol/client/actions";

interface CommunityModeratorsProps {
  groupAddress: string;
  className?: string;
}

export function CommunityModerators({ groupAddress, className = "" }: CommunityModeratorsProps) {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const adminsResult = await fetchAdminsFor(client, {
          address: evmAddress(groupAddress),
        });

        if (adminsResult.isOk()) {
          const admins = adminsResult.value.items;
          const transformedModerators = admins.map(admin => ({
            username:
              admin.account.username?.value ||
              `${admin.account.address.slice(0, 6)}...${admin.account.address.slice(-4)}`,
            address: admin.account.address,
            picture: admin.account.metadata?.picture,
            displayName:
              admin.account.metadata?.name ||
              admin.account.username?.value ||
              `${admin.account.address.slice(0, 6)}...${admin.account.address.slice(-4)}`,
          }));
          setModerators(transformedModerators);
        } else {
          console.warn("Failed to fetch admins:", adminsResult.error.message);
          setError("Failed to load moderators");
        }
      } catch (err) {
        console.warn("Error fetching admins:", err);
        setError("Error loading moderators");
      } finally {
        setIsLoading(false);
      }
    };

    if (groupAddress) {
      fetchModerators();
    }
  }, [groupAddress]);
  return (
    <Card className={`motion-preset-fade-in gradient-card border border-brand-200/50 ${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Moderators</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600"></div>
            <span className="ml-2 text-sm text-gray-500">Loading moderators...</span>
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : moderators.length > 0 ? (
          moderators.map(mod => (
            <Link
              key={mod.address}
              href={`/u/${mod.username}`}
              className="flex items-center space-x-3 transition-colors hover:text-brand-600"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={mod.picture || "/placeholder.svg?height=32&width=32"} alt={mod.displayName} />
                <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
                  {mod.displayName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{mod.displayName}</span>
                <span className="text-xs text-gray-500">@{mod.username}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">No moderators assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
