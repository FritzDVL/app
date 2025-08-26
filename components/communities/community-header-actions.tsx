"use client";

import { useState } from "react";
import Link from "next/link";
import { LeaveCommunityDialog } from "@/components/communities/community-leave-dialog";
import { Button } from "@/components/ui/button";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useIsModerator } from "@/hooks/communities/use-is-moderator";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { useLeaveCommunity } from "@/hooks/communities/use-leave-community";
import type { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { Settings } from "lucide-react";

export function CommunityHeaderActions({ community }: { community: Community }) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const joinCommunity = useJoinCommunity(community);
  const leaveCommunity = useLeaveCommunity(community);
  const isModerator = useIsModerator(community);
  const { isLoggedIn } = useAuthStore();
  const { isMember, updateIsMember, isLoading: isMemberLoading } = useCommunityMembership(community.address);

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
    <div className="mt-4 flex w-full shrink-0 flex-col gap-2 md:ml-6 md:mt-0 md:w-auto md:flex-row">
      <Button
        disabled={!isLoggedIn || isMemberLoading}
        onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
        size="sm"
        className={`w-full rounded-full px-4 py-2 font-medium transition-all duration-300 md:w-auto ${
          isMember
            ? "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
        }`}
      >
        {isMemberLoading ? "..." : isMember ? "Leave" : "Join"}
      </Button>

      {/* Settings Button - Only show for community mods */}
      {isModerator && (
        <Link href={`/communities/${community.address}/settings`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            aria-label="Community Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <LeaveCommunityDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        onConfirm={confirmLeaveCommunity}
      />
    </div>
  );
}
