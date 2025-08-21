"use client";

import { useEffect, useState } from "react";
import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ThreadClient } from "@/components/thread/thread-client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Community } from "@/lib/domain/communities/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThread } from "@/lib/services/thread/get-thread";
import { useSessionClient } from "@lens-protocol/react";

export default function ThreadPage({ params }: { params: { address: string } }) {
  const threadAddress = params.address;

  const [thread, setThread] = useState<any>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionClient = useSessionClient();

  useEffect(() => {
    if (sessionClient.loading) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let threadResponse;
        if (sessionClient && sessionClient.data) {
          threadResponse = await getThread(threadAddress, sessionClient.data);
        } else {
          threadResponse = await getThread(threadAddress);
        }
        if (!threadResponse.success || !threadResponse.thread) {
          setError("Thread not found");
          setLoading(false);
          return;
        }
        setThread(threadResponse.thread);
        const communityResponse = await getCommunity(threadResponse.thread.community);
        if (!communityResponse.success || !communityResponse.community) {
          setError("Community not found");
          setLoading(false);
          return;
        }
        setCommunity(communityResponse.community);
      } catch {
        setError("Error loading thread or community");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [threadAddress, sessionClient.data, sessionClient.loading]);

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }
  if (error || !thread || !community) {
    return <div className="text-center text-red-500">{error || "Not found"}</div>;
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
