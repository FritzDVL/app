"use client";

import { useState } from "react";
import Image from "next/image";
import { LeaveCommunityDialog } from "@/components/communities/community-leave-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { useLeaveCommunity } from "@/hooks/communities/use-leave-community";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { useAuthStore } from "@/stores/auth-store";
import { MessageCircle, Users } from "lucide-react";

export function CommunityHeader({ community }: { community: Community }) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const { isMember, updateIsMember, isLoading: isMemberLoading } = useCommunityMembership(community.address);
  const joinCommunity = useJoinCommunity(community);
  const leaveCommunity = useLeaveCommunity(community);
  const { isLoggedIn } = useAuthStore();

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

  if (!community) return null;

  return (
    <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardContent className="p-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-6 md:space-y-0">
          <div className="flex h-[100px] w-[100px] items-center justify-center">
            {community.logo ? (
              <Image
                src={groveLensUrlToHttp(community.logo)}
                alt={community.name}
                width={100}
                height={100}
                className="h-[100px] w-[100px] rounded-full border border-slate-200 bg-white object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-foreground">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 truncate text-3xl font-bold text-foreground">{community.name}</h1>
            <p className="mb-4 max-w-2xl truncate text-muted-foreground">{community.description}</p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
              disabled={!isLoggedIn || isMemberLoading}
              onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
              className={`rounded-full px-8 py-3 font-semibold transition-all duration-300 ${
                isMember
                  ? "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
              }`}
            >
              {isMemberLoading ? "..." : isMember ? "Leave Community" : "Join Community"}
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
