"use client";

import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ThreadClient } from "@/components/thread/thread-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCommunity } from "@/hooks/queries/use-community";
import { useThread } from "@/hooks/queries/use-thread";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";

export default function ThreadPage({ params }: { params: { address: string } }) {
  const threadAddress = params.address as Address;
  const sessionClient = useSessionClient();

  const { data: thread, isLoading: threadLoading, error: threadError } = useThread(threadAddress);
  const { data: community, isLoading: communityLoading, error: communityError } = useCommunity(thread?.community || "");

  if (threadLoading || communityLoading || sessionClient.loading) {
    return <LoadingSpinner text="Loading..." />;
  }
  if (threadError || communityError || !thread || !community) {
    return (
      <div className="text-center text-red-500">{threadError?.message || communityError?.message || "Not found"}</div>
    );
  }

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
