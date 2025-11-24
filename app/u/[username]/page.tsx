import { Profile } from "@/components/profile/profile";
import { StatusBanner } from "@/components/shared/status-banner";
import { getAccountByUsername } from "@/lib/services/account/get-account-by-username";
import { getAccountStats } from "@/lib/services/account/get-account-stats";
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

  if (!lensAccount || !lensAccountStats) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-3 py-4 text-center sm:px-4 sm:py-8">
        <StatusBanner
          type="info"
          title="Profile not found"
          message={`The user @${username} could not be found or is not connected to Lens.`}
        />
      </div>
    );
  }

  return (
    <>
      <Profile account={lensAccount} stats={lensAccountStats} userReplies={userReplies} />
    </>
  );
}
