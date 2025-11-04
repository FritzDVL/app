"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/external/lens/protocol-client";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { AccountAvailable, evmAddress } from "@lens-protocol/react";
import { Loader2, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";

export function CheckProfiles() {
  const [profiles, setProfiles] = useState<AccountAvailable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  const fetchProfiles = async () => {
    if (!address || !isConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAccountsAvailable(client, {
        managedBy: evmAddress(address),
        includeOwned: true,
      });

      if (result.isOk()) {
        setProfiles(result.value.items.filter((account: AccountAvailable) => account !== undefined));
      } else {
        setError("Failed to fetch profiles");
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("Error fetching profiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchProfiles();
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check Existing Profiles</CardTitle>
          <CardDescription>Connect your wallet to check for existing Lens profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Existing Profiles</CardTitle>
        <CardDescription>Check if your wallet has any existing Lens profiles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={fetchProfiles} disabled={isLoading} variant="outline" size="sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isLoading ? "Checking..." : "Refresh"}
          </Button>
          <span className="text-sm text-muted-foreground">
            Wallet: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </span>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-2">
            <p className="font-medium">
              Found {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
            </p>

            {profiles.length === 0 ? (
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  No Lens profiles found for this wallet. You can create a new profile below.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {profiles.map((profile, index) => (
                  <div key={profile.account.address} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          @{profile.account.username?.localName || profile.account.username?.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {profile.account.metadata?.name || "No display name"}
                        </p>
                        <p className="text-xs text-muted-foreground">{profile.account.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Profile #{index + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
