import React, { useEffect, useState } from "react";
import { CommunityBannedAccounts } from "@/components/communities/settings/community-banned-accounts";
import { CommunityMemberCard } from "@/components/communities/settings/community-member-card";
import { CommunityMembershipRequests } from "@/components/communities/settings/community-membership-requests";
import { CursorPagination } from "@/components/shared/cursor-pagination";
import { Community } from "@/lib/domain/communities/types";
import { client } from "@/lib/external/lens/protocol-client";
import { GroupMember, PageSize, PaginatedResultInfo, evmAddress } from "@lens-protocol/client";
import { fetchGroupMembers } from "@lens-protocol/client/actions";
import { UserCheck, UserX, Users } from "lucide-react";

interface CommunityMembersListProps {
  community: Community;
}

export function CommunityMembersList({ community }: CommunityMembersListProps) {
  const [activeTab, setActiveTab] = useState<"members" | "requests" | "banned">("members");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo | null>(null);

  const groupAddress = community?.group?.address;

  // Only show requests tab if membership approval is enabled
  const showRequestsTab = !!community.group?.membershipApprovalEnabled;

  // If the current tab is 'requests' but the feature is not enabled, fallback to 'members'
  React.useEffect(() => {
    if (!showRequestsTab && activeTab === "requests") {
      setActiveTab("members");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRequestsTab]);

  const fetchMembers = async (cursor?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGroupMembers(client, {
        group: evmAddress(groupAddress),
        pageSize: PageSize.Ten,
        ...(cursor ? { cursor } : {}),
      });
      if (result.isErr()) {
        setError(result.error.message || "Failed to fetch members");
        setLoading(false);
        return;
      }
      const { items, pageInfo } = result.value;
      setMembers(items as GroupMember[]);
      setPageInfo(pageInfo as PaginatedResultInfo);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupAddress) fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupAddress]);

  return (
    <div>
      {/* Sub-tabs */}
      <div className="mb-6 flex items-center space-x-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "members"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Members
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {community.memberCount}
          </span>
        </button>
        {showRequestsTab && (
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "requests"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Requests
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              0
            </span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("banned")}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            activeTab === "banned"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserX className="h-4 w-4" />
          Banned
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            0
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" && (
        <>
          {loading && <div className="text-center text-muted-foreground">Loading members…</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && members.length === 0 && (
            <div className="text-center text-muted-foreground">No members found.</div>
          )}
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {members.map(member => (
              <CommunityMemberCard key={member.account.address} member={member} />
            ))}
          </ul>
          <CursorPagination
            hasPrev={!!(pageInfo && pageInfo.prev)}
            hasNext={!!(pageInfo && pageInfo.next)}
            loading={loading}
            onPrev={pageInfo && pageInfo.prev ? () => fetchMembers(pageInfo.prev) : undefined}
            onNext={pageInfo && pageInfo.next ? () => fetchMembers(pageInfo.next) : undefined}
          />
        </>
      )}

      {activeTab === "requests" && <CommunityMembershipRequests community={community} />}

      {activeTab === "banned" && <CommunityBannedAccounts community={community} />}
    </div>
  );
}
