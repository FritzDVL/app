import { useState } from "react";
import Image from "next/image";
import { LeaveCommunityDialog } from "@/components/communities/community-leave-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { useLeaveCommunity } from "@/hooks/communities/use-leave-community";
import { useCommunity } from "@/hooks/queries/use-community";
import { useAuthStore } from "@/stores/auth-store";
import { Community } from "@/types/common";
import { MessageCircle, Users } from "lucide-react";

export function CommunityHeader({ communityAddress }: { communityAddress: string }) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const { data: community, isLoading } = useCommunity(communityAddress);
  const { isMember: isJoined, updateIsMember } = useCommunityMembership(communityAddress);
  const joinCommunity = useJoinCommunity(community as Community);
  const leaveCommunity = useLeaveCommunity(community as Community);
  const { isLoggedIn } = useAuthStore();

  // --- Handlers ---
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

  // --- Render ---
  if (isLoading || !community) return null;

  return (
    <Card className="mb-8 rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-6 md:space-y-0">
          <div className="flex h-[100px] w-[100px] items-center justify-center">
            {community.logo ? (
              <Image
                src={community.logo.replace("lens://", "https://api.grove.storage/")}
                alt={community.name}
                width={100}
                height={100}
                className="h-[100px] w-[100px] rounded-full border border-slate-200 bg-white object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-white">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 truncate text-3xl font-bold text-slate-900">{community.name}</h1>
            <p className="mb-4 max-w-2xl truncate text-slate-600">{community.description}</p>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {community.memberCount.toLocaleString()} members
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                {community.threadsCount} threads
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button
              disabled={!isLoggedIn}
              onClick={isJoined ? handleLeaveCommunity : handleJoinCommunity}
              className={`rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
                isJoined
                  ? "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
              }`}
            >
              {isJoined ? "Leave Community" : "Join Community"}
            </Button>
            <LeaveCommunityDialog
              open={showLeaveDialog}
              onOpenChange={setShowLeaveDialog}
              onConfirm={confirmLeaveCommunity}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
