"use client";

import { useState } from "react";
import { JoinedCommunities } from "@/components/account/joined-communities";
import { ProfileTabs } from "@/components/account/profile-tabs";
import { RecentActivity } from "@/components/account/recent-activity";
import { Community } from "@/lib/domain/communities/types";
import { Reply } from "@/lib/domain/replies/types";
import { Account } from "@lens-protocol/client";

interface ProfileTabsManagerProps {
  repliesTo: Reply[];
  joinedCommunities: Community[];
  lensAccount: Account;
}

export function ProfileTabsManager({ repliesTo, joinedCommunities, lensAccount }: ProfileTabsManagerProps) {
  const [activeTab, setActiveTabState] = useState<"recent" | "forums">("recent");
  // Adapt setActiveTab to match ProfileTabs signature
  const setActiveTab = (tab: string) => {
    if (tab === "recent" || tab === "forums") setActiveTabState(tab);
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="mb-4">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {activeTab === "recent" && <RecentActivity replies={repliesTo} />}
      {activeTab === "forums" && <JoinedCommunities communities={joinedCommunities} />}
    </div>
  );
}
