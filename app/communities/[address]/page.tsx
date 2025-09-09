import { CommunityThreads } from "@/components/communities/threads/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";
import { Address } from "@/types/common";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams?: { page?: string };
}) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress as Address);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return <div className="text-center text-red-500">Community not found</div>;
  }

  // Pagination logic
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Fetch threads on the server with pagination
  const threadsResult = await getCommunityThreads(community, { limit, offset });
  const threads = threadsResult.success ? (threadsResult.threads ?? []) : [];
  console.log("Threads Result:", threadsResult);
  return (
    <ProtectedRoute>
      <CommunityThreads community={community} threads={threads} page={page} limit={limit} />
    </ProtectedRoute>
  );
}
