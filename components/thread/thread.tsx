"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinCommunityAnnouncement } from "@/components/thread/join-community-announcement";
import { ThreadActions } from "@/components/thread/thread-actions";
import { ThreadCard } from "@/components/thread/thread-card";
import { ThreadRepliesList } from "@/components/thread/thread-replies-list";
import { ThreadSidebar } from "@/components/thread/thread-sidebar";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/lib/domain/communities/types";
import { Thread as ThreadType } from "@/lib/domain/threads/types";
import { useQueryClient } from "@tanstack/react-query";

interface ThreadProps {
  community: Community;
  thread: ThreadType;
}

export function Thread({ community, thread }: ThreadProps) {
  const [isJoinLoading, setIsJoinLoading] = useState(false);

  const { isMember, updateIsMember, isLoading } = useCommunityMembership(community.group.address);
  const join = useJoinCommunity(community);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleJoin = async () => {
    setIsJoinLoading(true);
    const status = await join();
    if (status) {
      updateIsMember(true);
      // Invalidate thread-replies query so replies list refetches
      queryClient.invalidateQueries({ queryKey: ["thread-replies", thread.id] });
      router.refresh();
    }
    setIsJoinLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {!isMember && !isLoading && (
            <JoinCommunityAnnouncement isLoading={isJoinLoading} onJoinCommunity={handleJoin} />
          )}
          <ThreadActions thread={thread} community={community} />
          <ThreadCard thread={thread} community={community} />
          <ThreadRepliesList thread={thread} community={community} />
        </div>
        <div className="hidden lg:block lg:pt-[54px]">
          <ThreadSidebar community={community} />
        </div>
      </div>
    </div>
  );
}
