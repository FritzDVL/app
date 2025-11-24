"use client";

import { useState } from "react";
import { ProfileRecentActivity } from "@/components/profile/profile-recent-activity";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Community } from "@/lib/domain/communities/types";
import { Reply } from "@/lib/domain/replies/types";

interface ProfileTabsManagerProps {
  repliesTo: Reply[];
  joinedCommunities: Community[];
}

export function ProfileTabsManager({ repliesTo }: ProfileTabsManagerProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-4 sm:p-8">
        {activeTab === "summary" && (
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Top Replies / Topics - Placeholder */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Top Replies</h3>
                <ProfileRecentActivity replies={repliesTo.slice(0, 3)} />
              </div>
              <div>
                <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Top Topics</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No topics created yet.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Recent Activity</h3>
            <ProfileRecentActivity replies={repliesTo} />
          </div>
        )}

        {activeTab === "badges" && (
          <div className="text-center text-slate-500 dark:text-gray-400">
            <p>Badges coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
