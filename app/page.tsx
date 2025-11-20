import { cookies } from "next/headers";
import { CommunityThreads } from "@/components/communities/threads/community-threads";
import { StatusBanner } from "@/components/shared/status-banner";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { TARGET_GROUP_ADDRESS, THREADS_PER_PAGE } from "@/lib/shared/constants";
import { Address } from "@/types/common";

export default async function HomePage() {
  const communityAddress = TARGET_GROUP_ADDRESS as Address;

  const communityResult = await getCommunity(communityAddress);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return (
      <div className="flex min-h-screen items-start justify-center">
        <div className="w-full max-w-md px-4 pt-12">
          <StatusBanner
            type="info"
            title="Community not found"
            message="The target community does not exist or could not be loaded. Please check the configuration."
          />
        </div>
      </div>
    );
  }

  // Read showAllPosts preference from cookie
  const COOKIE_KEY = `showAllPosts:${community.id}`;
  const cookieStore = cookies();
  const crosspostEnabledCookie = cookieStore.get(COOKIE_KEY)?.value === "true";

  // Fetch threads on the server with pagination, using cookie preference
  const threadsResult = await getCommunityThreads(community, {
    limit: THREADS_PER_PAGE,
    showAllPosts: crosspostEnabledCookie,
  });
  const threads = threadsResult.success ? (threadsResult.threads ?? []) : [];

  return (
    <div className="min-h-screen bg-background">
      <CommunityThreads community={community} threads={threads} initialCrosspostEnabled={crosspostEnabledCookie} />
    </div>
  );
}
