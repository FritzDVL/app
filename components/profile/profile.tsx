import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabsManager } from "@/components/profile/profile-tabs-manager";
import { Community } from "@/lib/domain/communities/types";
import { Reply } from "@/lib/domain/replies/types";
import { Account } from "@lens-protocol/client";

interface ProfileProps {
  account: Account;
  stats: { followers: number; following: number; posts: number };
  userReplies: Reply[];
  joinedCommunities: Community[];
}

export function Profile({ account, stats, userReplies, joinedCommunities }: ProfileProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-3 py-4 sm:space-y-8 sm:px-4 sm:py-8">
      {/* Profile Header */}
      <ProfileHeader lensAccount={account as Account} username={account.username?.value} />

      {/* Stats Cards */}
      <ProfileStats followers={stats.followers} following={stats.following} posts={stats.posts} reputation={0} />

      {/* Main Content */}
      <ProfileTabsManager repliesTo={userReplies} joinedCommunities={joinedCommunities} />
    </div>
  );
}
