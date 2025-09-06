import { useCallback, useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { client } from "@/lib/external/lens/protocol-client";
import { GroupMember, PageSize, PaginatedResultInfo, evmAddress } from "@lens-protocol/client";
import { fetchGroupMembers } from "@lens-protocol/client/actions";

export function useCommunityMembers(community: Community) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo | null>(null);

  const fetchMembers = useCallback(
    async (cursor?: string | null) => {
      setLoading(true);
      try {
        const result = await fetchGroupMembers(client, {
          group: evmAddress(community.group.address),
          pageSize: PageSize.Ten,
          ...(cursor ? { cursor } : {}),
        });
        if (result.isErr()) {
          setLoading(false);
          return;
        }
        const { items, pageInfo } = result.value;
        setMembers(items as GroupMember[]);
        setPageInfo(pageInfo as PaginatedResultInfo);
      } catch (e: any) {
        // error handling can be done via toast in the component if needed
      } finally {
        setLoading(false);
      }
    },
    [community.group.address],
  );

  useEffect(() => {
    if (community.group.address) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community.group.address]);

  const removeMemberFromList = (member: GroupMember) => {
    setMembers(prev => prev.filter(m => m.account.address !== member.account.address));
  };

  const hasNext = !!(pageInfo && pageInfo.next);
  const hasPrev = !!(pageInfo && pageInfo.prev);

  const next = hasNext ? () => fetchMembers(pageInfo!.next) : undefined;
  const previous = hasPrev ? () => fetchMembers(pageInfo!.prev) : undefined;

  return {
    members,
    loading,
    fetchMembers,
    removeMemberFromList,
    hasNext,
    hasPrev,
    next,
    previous,
  };
}
