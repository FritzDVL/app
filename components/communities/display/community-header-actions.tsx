"use client";

import { useEffect, useState } from "react";
import { LeaveCommunityDialog } from "@/components/communities/display/community-leave-dialog";
import { JoinCommunityButton } from "@/components/communities/display/join-community-button";
import { LeaveCommunityButton } from "@/components/communities/display/leave-community-button";
import { NewThreadButton } from "@/components/communities/display/new-thread-button";
import { Community } from "@/lib/domain/communities/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";

interface CommunityHeaderActionsProps {
  communityAddr: Address;
}

export function CommunityHeaderActions({ communityAddr }: CommunityHeaderActionsProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [community, setCommunity] = useState<Community | null>(null);
  const { isLoggedIn } = useAuthStore();
  const sessionClient = useSessionClient();

  useEffect(() => {
    const doFetchCommunity = async () => {
      if (sessionClient.loading || !sessionClient.data) {
        return;
      }
      try {
        const community = await getCommunity(communityAddr, sessionClient.data);
        if (community.success && community.community) {
          setCommunity(community.community);
        }
      } catch (error) {
        console.error("Error fetching community data:", error);
      }
    };
    doFetchCommunity();
  }, [communityAddr, sessionClient.data, sessionClient.loading]);

  const handleDialogOpen = (open: boolean) => setShowLeaveDialog(open);

  if (!isLoggedIn || !community) {
    return null;
  }
  console.log("Rendering CommunityHeaderActions with community:", community);
  return (
    <div className="mt-0 flex w-full flex-row items-center justify-between gap-2 md:mt-2">
      <div className="flex flex-row items-center gap-1.5">
        <NewThreadButton community={community} />
      </div>
      <div className="flex flex-row items-center gap-1.5">
        <JoinCommunityButton community={community} />
        <LeaveCommunityButton community={community} onDialogOpen={handleDialogOpen} />
      </div>
      <LeaveCommunityDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog} onConfirm={() => {}} />
    </div>
  );
}
