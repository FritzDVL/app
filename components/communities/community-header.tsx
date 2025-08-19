"use client";

import { useState } from "react";
import Image from "next/image";
import { ThreadNewButton } from "../thread/thread-new-button";
import { LeaveCommunityDialog } from "@/components/communities/community-leave-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <>
      <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            {/* Logo, Name, and Join/Leave Button in a single row (stacked on mobile) */}
            <div className="flex h-[80px] w-[80px] items-center justify-center md:mr-6 md:h-[100px] md:w-[100px]">
              {community.logo ? (
                <Image
                  src={groveLensUrlToHttp(community.logo)}
                  alt={community.name}
                  width={100}
                  height={100}
                  className="h-[80px] w-[80px] rounded-full border border-slate-200 bg-white object-cover md:h-[100px] md:w-[100px]"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-foreground md:h-[100px] md:w-[100px]">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full min-w-0 flex-1">
              <div className="flex w-full flex-col items-center md:flex-row md:items-start md:justify-between">
                <div className="w-full min-w-0 flex-1 text-center md:text-left">
                  <h1 className="mb-2 truncate text-2xl font-bold text-foreground md:text-3xl">{community.name}</h1>
                  <p className="mx-auto mb-4 max-w-2xl whitespace-pre-line break-words text-muted-foreground md:mx-0">
                    {community.description}
                  </p>
                  <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground md:flex-row md:space-x-6 md:space-y-0">
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
                <div className="mt-4 flex w-full shrink-0 flex-col gap-3 md:ml-6 md:mt-0 md:w-auto md:flex-row">
                  <Button
                    disabled={!isLoggedIn || isMemberLoading}
                    onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
                    className={`w-full rounded-full px-8 py-3 font-semibold transition-all duration-300 md:w-auto ${
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
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Post Thread Form */}
      {isMember && (
        <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Start a Discussion</h3>
              <ThreadNewButton communityAddress={community.address} isJoined={isMember} />
            </div>
          </CardHeader>
        </Card>
      )}
    </>
  );
}
