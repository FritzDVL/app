"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CommunityHeader } from "@/components/communities/community-header";
import { CommunitySidebar } from "@/components/communities/community-sidebar";
import { CommunityThreads } from "@/components/communities/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { useLeaveCommunity } from "@/hooks/communities/use-leave-community";
import { useCommunity } from "@/hooks/queries/use-community";
import { Community } from "@/lib/domain/communities/types";

export default function CommunityPage() {
  const params = useParams();
  const communityAddress = params.address as string;

  // Membership state and logic moved here
  const { data: community } = useCommunity(communityAddress);
  const { isMember: isJoined, updateIsMember } = useCommunityMembership(communityAddress);
  const joinCommunity = useJoinCommunity(community as Community);
  const leaveCommunity = useLeaveCommunity(community as Community);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handleJoinCommunity = async () => {
    try {
      await joinCommunity();
      updateIsMember(true);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const handleLeaveCommunity = async () => setShowLeaveDialog(true);

  const confirmLeaveCommunity = async () => {
    try {
      await leaveCommunity();
      updateIsMember(false);
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityHeader
              communityAddress={communityAddress}
              isJoined={isJoined}
              onJoin={handleJoinCommunity}
              onLeave={handleLeaveCommunity}
              showLeaveDialog={showLeaveDialog}
              setShowLeaveDialog={setShowLeaveDialog}
              confirmLeaveCommunity={confirmLeaveCommunity}
            />
            {/* You can now use isJoined here to conditionally render New Thread form */}
            <CommunityThreads communityAddress={communityAddress} isJoined={isJoined} />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitySidebar communityAddress={communityAddress} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
