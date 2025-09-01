import React, { useState } from "react";
import { CommunityMembers } from "./community-members";
import { CommunityBannedAccounts } from "@/components/communities/settings/members/community-banned-accounts";
import { CommunityMembershipRequests } from "@/components/communities/settings/members/community-membership-requests";
import { Community } from "@/lib/domain/communities/types";
import { UserCheck, UserX, Users } from "lucide-react";

interface CommunityMembersManagerProps {
  community: Community;
}

export function CommunityMembersManager({ community }: CommunityMembersManagerProps) {
  const [activeTab, setActiveTab] = useState<"members" | "requests" | "banned">("members");

  const groupAddress = community?.group?.address;
  const showRequestsTab = !!community.group?.membershipApprovalEnabled;
  // const canRemove = community.group.operations?.canRemoveMember.__typename === "GroupOperationValidationPassed";
  const canRemove = true;

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
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" && <CommunityMembers community={community} />}

      {activeTab === "requests" && <CommunityMembershipRequests community={community} />}

      {activeTab === "banned" && <CommunityBannedAccounts community={community} />}
    </div>
  );
}
