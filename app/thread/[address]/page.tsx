import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ThreadMainCard } from "@/components/thread/thread-main-card";
import { ThreadRepliesList } from "@/components/thread/thread-replies-list";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Community } from "@/lib/domain/communities/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThreadReplies } from "@/lib/services/reply/get-thread-replies";
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

  const repliesResponse = await getThreadReplies(thread.address);
  if (!repliesResponse.success) {
    return <div className="text-center text-red-500">Failed to load replies</div>;
  }
  const replies = repliesResponse.success
    ? Array.isArray(repliesResponse.data)
      ? repliesResponse.data
      : (repliesResponse.data?.replies ?? [])
    : [];

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div className="mb-2">
          <BackNavigationLink href={thread?.community ? `/communities/${thread.community}` : "/communities"}>
            Back to Community
          </BackNavigationLink>
        </div>

        {/* Community Join Banner - shown if user is not a member */}
        {community && <CommunityJoinBanner community={community} />}

        <ThreadMainCard thread={thread} />
        <ThreadRepliesList thread={thread} replies={replies} />
      </div>
    </ProtectedRoute>
  );
}
