"use client";

import { useState } from "react";
import { ProfileRecentActivity } from "@/components/profile/profile-recent-activity";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Reply } from "@/lib/domain/replies/types";

interface ProfileTabsManagerProps {
  repliesTo: Reply[];
}

export function ProfileTabsManager({ repliesTo }: ProfileTabsManagerProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-4 sm:p-8">
        {activeTab === "summary" && (
          <div className="space-y-12">
            {/* Row 1: Top Replies & Top Topics */}
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Top Replies
                </h3>
                {repliesTo.length > 0 ? (
                  <ProfileRecentActivity replies={repliesTo.slice(0, 3)} />
                ) : (
                  <p className="text-sm text-slate-500 dark:text-gray-400">No replies yet.</p>
                )}
              </div>
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Top Topics
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No topics yet.</p>
              </div>
            </div>

            {/* Row 2: Top Links & Most Replied To */}
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Top Links
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No links yet.</p>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Most Replied To
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No replies yet.</p>
              </div>
            </div>

            {/* Row 3: Most Liked By & Most Liked */}
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Most Liked By
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No likes yet.</p>
              </div>
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  Most Liked
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">No likes yet.</p>
              </div>
            </div>

            {/* Row 4: Top Badges */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                Top Badges
              </h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">No badges yet.</p>
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
