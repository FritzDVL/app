"use client";

import { useState } from "react";
import { ProfileJoinedCommunities } from "@/components/profile/profile-joined-communities";
import { ProfileRecentActivity } from "@/components/profile/profile-recent-activity";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Community } from "@/lib/domain/communities/types";
import { Reply } from "@/lib/domain/replies/types";

interface ProfileTabsManagerProps {
  repliesTo: Reply[];
  joinedCommunities: Community[];
}

export function ProfileTabsManager({ repliesTo, joinedCommunities }: ProfileTabsManagerProps) {
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
      {activeTab === "recent" && <ProfileRecentActivity replies={repliesTo} />}
      {activeTab === "forums" && <ProfileJoinedCommunities communities={joinedCommunities} />}
    </div>
  );
}
