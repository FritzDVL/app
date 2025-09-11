import { CommunityThreads } from "@/components/communities/threads/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { THREADS_PER_PAGE } from "@/lib/shared/constants";
import { Address } from "@/types/common";

export default async function CommunityPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress as Address);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return <div className="text-center text-red-500">Community not found</div>;
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
