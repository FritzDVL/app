"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { JoinedCommunities } from "@/components/account/joined-communities";
import { ProfileHeader } from "@/components/account/profile-header";
import { ProfileStats } from "@/components/account/profile-stats";
import { ProfileTabs } from "@/components/account/profile-tabs";
import { RecentActivity } from "@/components/account/recent-activity";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileAccount } from "@/hooks/account/use-profile-account";
import { useLensReputationScore } from "@/hooks/common/use-lensreputation-score";
import { useProfileJoinedCommunities } from "@/hooks/queries/use-profile-joined-communities";
import { useProfileReplies } from "@/hooks/queries/use-profile-replies";
import { Address } from "@/types/common";
import { Account } from "@lens-protocol/client";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("recent");

  const { lensAccount, stats, isLoading } = useProfileAccount(username);
  const { data: userReplies = [], isLoading: loadingReplies } = useProfileReplies(lensAccount?.address);
  const { data: joinedCommunities = [], isLoading: loadingCommunities } = useProfileJoinedCommunities(
    lensAccount?.address,
  );
  const { reputation } = useLensReputationScore(
    lensAccount?.owner as Address | undefined,
    lensAccount?.address as Address | undefined,
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-8">
        <div className="animate-pulse space-y-4 sm:space-y-8">
          <div className="h-48 rounded-2xl bg-white/60 backdrop-blur-sm sm:h-64 sm:rounded-3xl"></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/60 backdrop-blur-sm sm:h-20 sm:rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lensAccount && !isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-3 py-4 text-center sm:px-4 sm:py-8">
        <Card className="dark:bg-border-700/60 mx-auto max-w-md rounded-2xl bg-white backdrop-blur-sm dark:bg-gray-800 sm:rounded-3xl">
          <CardContent className="p-6 sm:p-8">
            <h1 className="mb-3 text-xl font-bold text-foreground sm:mb-4 sm:text-2xl">Profile not found</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              The user @{username} could not be found or is not connected to Lens.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:space-y-8 sm:px-4 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader lensAccount={lensAccount as Account} username={username} />

        {/* Stats Cards */}
        <ProfileStats
          followers={stats.followers}
          following={stats.following}
          posts={stats.posts}
          reputation={reputation || 0}
          loading={stats.loading}
        />

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-8">
          {/* Minimalist Tab Navigation */}
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Sections */}
          {activeTab === "recent" && <RecentActivity loading={loadingReplies} replies={userReplies} />}

          {activeTab === "forums" && (
            <JoinedCommunities loading={loadingCommunities} communities={joinedCommunities} lensAccount={lensAccount} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
