import { ProfileHeader } from "@/components/account/profile-header";
import { ProfileStats } from "@/components/account/profile-stats";
import { ProfileTabsManager } from "@/components/account/profile-tabs-manager";
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
      <ProfileTabsManager repliesTo={userReplies} joinedCommunities={joinedCommunities} lensAccount={account} />
    </div>
  );
}
