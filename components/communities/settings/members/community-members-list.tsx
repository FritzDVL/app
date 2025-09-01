import React, { useEffect, useState } from "react";
import { CommunityBannedAccounts } from "@/components/communities/settings/members/community-banned-accounts";
import { CommunityMemberCard } from "@/components/communities/settings/members/community-member-card";
import { CommunityMembershipRequests } from "@/components/communities/settings/members/community-membership-requests";
import { CursorPagination } from "@/components/shared/cursor-pagination";
import { useCommunityBannedMembers } from "@/hooks/communities/use-community-banned-members";
import { useCommunityMembers } from "@/hooks/communities/use-community-members";
import { Community } from "@/lib/domain/communities/types";
import { GroupBannedAccount } from "@lens-protocol/client";
import { UserCheck, UserX, Users } from "lucide-react";

interface CommunityMembersListProps {
  community: Community;
}

export function CommunityMembersList({ community }: CommunityMembersListProps) {
  const [activeTab, setActiveTab] = useState<"members" | "requests" | "banned">("members");
  const [totalMembers, setTotalMembers] = useState(community.memberCount);
  const [totalBanned, setTotalBanned] = useState(0);

  const groupAddress = community?.group?.address;
  const showRequestsTab = !!community.group?.membershipApprovalEnabled;
  // const canRemove = community.group.operations?.canRemoveMember.__typename === "GroupOperationValidationPassed";
  const canRemove = true;

  const { members, loading, removeMemberFromList, hasNext, hasPrev, next, previous } = useCommunityMembers(community);
  const {
    banned,
    bannedLoading,
    removeBannedFromList,
    hasNext: bannedHasNext,
    hasPrev: bannedHasPrev,
    next: bannedNext,
    previous: bannedPrevious,
  } = useCommunityBannedMembers(community);

  const handleUnbanMember = (banned: GroupBannedAccount) => {
    removeBannedFromList(banned);
    setTotalBanned(total => total - 1);
  };

  useEffect(() => {
    setTotalBanned(banned.length);
  }, [banned]);

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
            {totalMembers}
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
            {totalBanned}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" && (
        <>
          {loading && <div className="text-center text-muted-foreground">Loading members…</div>}
          {!loading && members.length === 0 && (
            <div className="text-center text-muted-foreground">No members found.</div>
          )}
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {members.map(member => (
              <CommunityMemberCard
                key={member.account.address}
                member={member}
                community={community}
                canRemove={canRemove}
                onRemove={member => {
                  removeMemberFromList(member);
                  setTotalMembers(total => total - 1);
                }}
              />
            ))}
          </ul>
          <CursorPagination hasPrev={hasPrev} hasNext={hasNext} loading={loading} onPrev={previous} onNext={next} />
        </>
      )}

      {activeTab === "requests" && <CommunityMembershipRequests community={community} />}

      {activeTab === "banned" && (
        <>
          {bannedLoading && <div className="text-center text-muted-foreground">Loading banned accounts…</div>}
          {!bannedLoading && banned.length === 0 && (
            <div className="text-center text-muted-foreground">No banned accounts found.</div>
          )}
          <CommunityBannedAccounts bannedMembers={banned} groupAddress={groupAddress} onUnban={handleUnbanMember} />
          <CursorPagination
            hasPrev={bannedHasPrev}
            hasNext={bannedHasNext}
            loading={bannedLoading}
            onPrev={bannedPrevious}
            onNext={bannedNext}
          />
        </>
      )}
    </div>
  );
}
