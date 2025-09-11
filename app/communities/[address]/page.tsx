import { CommunityThreads } from "@/components/communities/threads/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { StatusBanner } from "@/components/shared/status-banner";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";
import { Address } from "@/types/common";

export default async function CommunityPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress as Address);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return (
      <div className="flex min-h-screen items-start justify-center">
        <div className="w-full max-w-md px-4 pt-12">
          <StatusBanner
            type="info"
            title="Community not found"
            message="The requested community does not exist or could not be loaded."
          />
        </div>
      </div>
    );
  }

  // Fetch threads on the server with pagination
  const threadsResult = await getCommunityThreads(community, { limit: THREADS_PER_PAGE });
  const threads = threadsResult.success ? (threadsResult.threads ?? []) : [];

  return (
    <ProtectedRoute>
      <CommunityThreads community={community} threads={threads} />
    </ProtectedRoute>
  );
}
