"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeaveCommunityDialog } from "@/components/communities/display/community-leave-dialog";
import { Button } from "@/components/ui/button";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { useLeaveCommunity } from "@/hooks/communities/use-leave-community";
import type { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { LogIn, LogOut, PenTool } from "lucide-react";

export function CommunityHeaderActions({ community }: { community: Community }) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const joinCommunity = useJoinCommunity(community);
  const leaveCommunity = useLeaveCommunity(community);
  const { isLoggedIn } = useAuthStore();
  const { isMember, updateIsMember, isLoading: isMemberLoading } = useCommunityMembership(community.group.address);
  const router = useRouter();

  const handleJoinCommunity = async () => {
    try {
      const status = await joinCommunity();
      updateIsMember(status);
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
    <div className="mt-0 flex w-full flex-row items-center justify-between gap-2 md:mt-2">
      <div className="flex flex-row items-center gap-1.5">
        {isMember && (
          <Button
            onClick={() => {
              router.push(`/communities/${community.group.address}/new-thread`);
            }}
            variant="default"
            size="sm"
            className="h-8 bg-green-600 px-3 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:bg-green-700 hover:shadow-md"
          >
            <PenTool className="mr-1.5 h-3 w-3" />
            <span className="hidden md:inline">New Thread</span>
            <span className="md:hidden">New</span>
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center gap-1.5">
        {community.group.operations && community.group.operations.canJoin && (
          <Button
            disabled={!isLoggedIn || isMemberLoading}
            onClick={handleJoinCommunity}
            size="sm"
            variant="default"
            className="h-8 px-3 text-xs font-medium transition-all duration-150"
          >
            {isMemberLoading ? (
              <>
                <span className="mr-1.5 h-2.5 w-2.5 animate-spin rounded-full border border-gray-400 border-t-transparent" />
                <span className="hidden md:inline">Loading</span>
                <span className="md:hidden">...</span>
              </>
            ) : (
              <>
                <LogIn className="mr-1.5 h-3 w-3" />
                <span className="hidden md:inline">Join</span>
                <span className="md:hidden">Join</span>
              </>
            )}
          </Button>
        )}
        {community.group.operations && community.group.operations.canLeave && (
          <Button
            disabled={!isLoggedIn || isMemberLoading}
            onClick={handleLeaveCommunity}
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs font-medium transition-all duration-150"
          >
            {isMemberLoading ? (
              <>
                <span className="mr-1.5 h-2.5 w-2.5 animate-spin rounded-full border border-gray-400 border-t-transparent" />
                <span className="hidden md:inline">Loading</span>
                <span className="md:hidden">...</span>
              </>
            ) : (
              <>
                <LogOut className="mr-1.5 h-3 w-3" />
                <span className="hidden md:inline">Leave</span>
                <span className="md:hidden">Leave</span>
              </>
            )}
          </Button>
        )}
      </div>
      <LeaveCommunityDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        onConfirm={confirmLeaveCommunity}
      />
    </div>
  );
}
