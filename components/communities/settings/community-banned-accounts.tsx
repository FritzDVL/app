import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CursorPagination } from "@/components/shared/cursor-pagination";
import { Community } from "@/lib/domain/communities/types";
import { client } from "@/lib/external/lens/protocol-client";
import { GroupBannedAccount, PaginatedResultInfo, evmAddress } from "@lens-protocol/client";
import { fetchGroupBannedAccounts } from "@lens-protocol/client/actions";

interface CommunityBannedAccountsProps {
  community: Community;
}

export function CommunityBannedAccounts({ community }: CommunityBannedAccountsProps) {
  const [banned, setBanned] = useState<GroupBannedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo | null>(null);

  const fetchBanned = async (cursor?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGroupBannedAccounts(client, {
        group: evmAddress(community.group.address),
        ...(cursor ? { cursor } : {}),
      });
      if (result.isErr()) {
        setError(result.error.message || "Failed to fetch banned accounts");
        setLoading(false);
        return;
      }
      const { items, pageInfo } = result.value;
      setBanned([...items]);
      setPageInfo(pageInfo);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (community.group.address) {
      fetchBanned();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.group.address]);

  return (
    <div className="py-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        Banned Accounts
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {banned.length}
        </span>
      </h3>
      {loading && <div className="text-center text-muted-foreground">Loading banned accounts…</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && banned.length === 0 && (
        <div className="text-center text-muted-foreground">No banned accounts found.</div>
      )}
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {banned.map(ban => {
          const { account, bannedAt, bannedBy } = ban;
          const avatarUrl = account.metadata?.picture || "/logo.png";
          const username = account.username?.localName || account.username?.value || "Unknown";
          const name = account.metadata?.name || username;
          return (
            <li
              key={account.address}
              className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <Image
                src={avatarUrl}
                alt={username}
                className="h-12 w-12 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                width={48}
                height={48}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="truncate text-base font-semibold text-foreground">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">@{username}</span>
                </div>
                <div className="mt-1 break-all font-mono text-xs text-gray-500">{account.address}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Banned: {new Date(bannedAt).toLocaleDateString()} by{" "}
                  {bannedBy?.username?.localName || bannedBy?.username?.value || bannedBy?.address}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <CursorPagination
        hasPrev={!!(pageInfo && pageInfo.prev)}
        hasNext={!!(pageInfo && pageInfo.next)}
        loading={loading}
        onPrev={pageInfo && pageInfo.prev ? () => fetchBanned(pageInfo.prev) : undefined}
        onNext={pageInfo && pageInfo.next ? () => fetchBanned(pageInfo.next) : undefined}
      />
    </div>
  );
}
