"use client";

import { useEffect, useState } from "react";
import { revalidateThreadPath } from "@/app/actions/revalidate-path";
import { Button } from "@/components/ui/button";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { useAuthStore } from "@/stores/auth-store";
import { useSessionClient } from "@lens-protocol/react";
import { Plus, Users } from "lucide-react";

interface CommunityJoinBannerProps {
  community: Community;
  thread: Thread;
}

export function CommunityJoinBanner({ community, thread }: CommunityJoinBannerProps) {
  const [isMember, setIsMember] = useState<boolean>(false);

  const { isLoggedIn } = useAuthStore();
  const { data: sessionClient } = useSessionClient();
  const join = useJoinCommunity(community);

  useEffect(() => {
    const doFetchCommunityOps = async () => {
      if (!sessionClient) return;
      const communityWithOps = await getCommunity(community.group.address, sessionClient);
      if (communityWithOps.success && communityWithOps.community) {
        setIsMember(!!communityWithOps.community.group.operations?.isMember);
      }
    };
    doFetchCommunityOps();
  }, [community, sessionClient]);

  const handleJoin = async () => {
    await join();
    setIsMember(true);
    revalidateThreadPath(thread.feed.address);
  };

  const showBanner = !isMember && isLoggedIn;
  if (!showBanner) {
    return null;
  }

  return (
    <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/10 to-brand-600/10 ring-2 ring-brand-200/50">
            <Users className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Join {community.name}</h3>
            <p className="text-sm text-muted-foreground">
              Join this community to participate in discussions and stay updated
            </p>
          </div>
        </div>
        <Button
          onClick={handleJoin}
          size="sm"
          className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Join Community
        </Button>
      </div>
    </div>
  );
}
