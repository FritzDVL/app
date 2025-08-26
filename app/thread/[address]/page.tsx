import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ThreadClient } from "@/components/thread/thread-client";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThread } from "@/lib/services/thread/get-thread";
import { Address } from "@/types/common";

// Server Component
export default async function ThreadPage({ params }: { params: { address: string } }) {
  const threadAddress = params.address as Address;

  // Obtener datos en el servidor
  const thread = await getThread(threadAddress);
  if (thread.error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-red-500">Error loading thread: {thread.error}</p>
      </div>
    );
  }
  if (!thread.thread) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">Thread not found</p>
      </div>
    );
  }

  const community = thread ? await getCommunity(thread.thread?.community) : null;
  if (community?.error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-red-500">Error loading community: {community.error}</p>
      </div>
    );
  }
  if (!community?.community) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">Community not found</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Community Join Banner - shown if user is not a member */}
        {community && <CommunityJoinBanner community={community.community} />}
        <ThreadClient thread={thread.thread} />
      </div>
    </ProtectedRoute>
  );
}
