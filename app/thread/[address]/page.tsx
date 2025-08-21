import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ThreadClient } from "@/components/thread/thread-client";
import { Community } from "@/lib/domain/communities/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThread } from "@/lib/services/thread/get-thread";

export default async function ThreadPage({ params }: { params: { address: string } }) {
  const threadAddress = params.address;

  const threadResponse = await getThread(threadAddress);
  if (!threadResponse.success || !threadResponse.thread) {
    return <div className="text-center text-red-500">Thread not found</div>;
  }
  const thread = threadResponse.thread;

  const communityResponse = await getCommunity(thread.community);
  if (!communityResponse.success || !communityResponse.community) {
    return <div className="text-center text-red-500">Community not found</div>;
  }
  const community: Community = communityResponse.community;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Community Join Banner - shown if user is not a member */}
        {community && <CommunityJoinBanner community={community} />}

        <ThreadClient thread={thread} />
      </div>
    </ProtectedRoute>
  );
}
