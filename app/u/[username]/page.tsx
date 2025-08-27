import { Profile } from "@/components/profile/profile";
import { Card, CardContent } from "@/components/ui/card";
import { getAccountByUsername } from "@/lib/services/account/get-account-by-username";
import { getAccountStats } from "@/lib/services/account/get-account-stats";
import { getCommunitiesJoined } from "@/lib/services/community/get-communities-joined";
import { getLatestRepliesByAuthor } from "@/lib/services/reply/get-latest-replies-by-author";
import { Account } from "@lens-protocol/client";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = params.username;
  const accountResult = await getAccountByUsername(username);
  const lensAccount: Account | null = accountResult.success && accountResult.account ? accountResult.account : null;

  const lensAccountStatsResult = await getAccountStats(lensAccount?.address);
  const lensAccountStats =
    lensAccountStatsResult.success && lensAccountStatsResult.stats ? lensAccountStatsResult.stats : null;

  const repliesResult = await getLatestRepliesByAuthor(lensAccount?.address, 10);
  const userReplies = repliesResult.success && repliesResult.replies ? repliesResult.replies : [];
  const joinedCommunitiesResult = await getCommunitiesJoined(lensAccount?.address);
  const joinedCommunities =
    joinedCommunitiesResult.success && joinedCommunitiesResult.communities ? joinedCommunitiesResult.communities : [];

  if (!lensAccount || !lensAccountStats) {
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
    <>
      <Profile
        account={lensAccount}
        stats={lensAccountStats}
        userReplies={userReplies}
        joinedCommunities={joinedCommunities}
      />
    </>
  );
}
