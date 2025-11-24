import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabsManager } from "@/components/profile/profile-tabs-manager";
import { Reply } from "@/lib/domain/replies/types";
import { Account } from "@lens-protocol/client";

interface ProfileProps {
  account: Account;
  stats: { followers: number; following: number; posts: number };
  userReplies: Reply[];
}

export function Profile({ account, stats, userReplies }: ProfileProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-8">
      {/* Profile Header */}
      <ProfileHeader lensAccount={account as Account} username={account.username?.value} />

      {/* Stats Grid */}
      <ProfileStats posts={stats.posts} />

      {/* Main Content (Tabs) */}
      <div className="mt-8 rounded-lg bg-white shadow-sm dark:bg-gray-900">
        <ProfileTabsManager repliesTo={userReplies} />
      </div>
    </div>
  );
}
