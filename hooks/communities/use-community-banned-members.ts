import { useCallback, useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { client } from "@/lib/external/lens/protocol-client";
import { GroupBannedAccount, PaginatedResultInfo, evmAddress } from "@lens-protocol/client";
import { fetchGroupBannedAccounts } from "@lens-protocol/client/actions";

export function useCommunityBannedMembers(community: Community) {
  const [banned, setBanned] = useState<GroupBannedAccount[]>([]);
  const [bannedPageInfo, setBannedPageInfo] = useState<PaginatedResultInfo | null>(null);
  const [bannedLoading, setBannedLoading] = useState(false);

  const fetchBannedMembers = useCallback(
    async (cursor?: string | null) => {
      setBannedLoading(true);
      try {
        const result = await fetchGroupBannedAccounts(client, {
          group: evmAddress(community.group.address),
          ...(cursor ? { cursor } : {}),
        });
        if (result.isErr()) {
          setBannedLoading(false);
          return;
        }
        const { items, pageInfo } = result.value;
        setBanned([...items]);
        setBannedPageInfo(pageInfo);
      } catch (e: any) {
        // error handling can be done via toast in the component if needed
      } finally {
        setBannedLoading(false);
      }
    },
    [community.group.address],
  );

  useEffect(() => {
    if (community.group.address) {
      fetchBannedMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.group.address]);

  const hasNext = !!(bannedPageInfo && bannedPageInfo.next);
  const hasPrev = !!(bannedPageInfo && bannedPageInfo.prev);

  const next = hasNext ? () => fetchBannedMembers(bannedPageInfo!.next) : undefined;
  const previous = hasPrev ? () => fetchBannedMembers(bannedPageInfo!.prev) : undefined;

  return {
    banned,
    bannedLoading,
    fetchBannedMembers,
    hasNext,
    hasPrev,
    next,
    previous,
  };
}
