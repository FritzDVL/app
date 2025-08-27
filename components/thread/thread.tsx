import React from "react";
import { CommunityJoinBanner } from "@/components/communities/community-join-banner";
import { ThreadActions } from "@/components/thread/thread-actions";
import { ThreadCard } from "@/components/thread/thread-card";
import { ThreadRepliesList } from "@/components/thread/thread-replies-list";
import { Community } from "@/lib/domain/communities/types";
import { Thread as ThreadType } from "@/lib/domain/threads/types";

interface ThreadProps {
  community: Community;
  thread: ThreadType;
}

export function Thread({ community, thread }: ThreadProps) {
  return (
    <>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {community && <CommunityJoinBanner community={community} />}
        <ThreadActions thread={thread} />
        <ThreadCard thread={thread} />
        <ThreadRepliesList thread={thread} />
      </div>
    </>
  );
}
