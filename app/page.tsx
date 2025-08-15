import { FeaturedCommunities } from "@/components/home/featured-communities";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { ThreadsSwitcher } from "@/components/home/threads-switcher";
import { getFeaturedCommunities } from "@/lib/services/community/get-featured-communities";
import { getForumStatistics } from "@/lib/services/stats/get-forum-statistics";
import { getFeaturedThreads } from "@/lib/services/thread/get-featured-threads";
import { getLatestThreads } from "@/lib/services/thread/get-latest-threads";

export default async function HomePage() {
  const forumStatsResult = await getForumStatistics();
  const forumStats = forumStatsResult.success && forumStatsResult.stats ? forumStatsResult.stats : null;
  const statsError = !forumStatsResult.success;

  const latestThreadsResult = await getLatestThreads(5);
  const latestThreads = latestThreadsResult.success ? (latestThreadsResult.threads ?? []) : [];

  const featuredThreadsResult = await getFeaturedThreads(5);
  const featuredThreads = featuredThreadsResult.success ? (featuredThreadsResult.threads ?? []) : [];

  const featuredCommunitiesResult = await getFeaturedCommunities();
  const featuredCommunities = featuredCommunitiesResult.success ? (featuredCommunitiesResult.communities ?? []) : [];

  return (
    <>
      <HeroSection />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StatsBar loadingStats={false} statsError={statsError} forumStats={forumStats ?? undefined} />
        <div className="w-full">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full gap-8 lg:w-2/3 lg:pr-4">
              <ThreadsSwitcher featuredThreads={featuredThreads} latestThreads={latestThreads} />
            </div>
            <div className="w-full gap-8 lg:w-1/3 lg:pl-4">
              <FeaturedCommunities featuredCommunities={featuredCommunities} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
