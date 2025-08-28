import { CommunityThreadsList } from "@/components/communities/community-threads-list";
import { CommunityHeader } from "@/components/communities/display/community-header";
import { CommunityNavActions } from "@/components/communities/display/community-nav-actions";
import { CommunitySidebar } from "@/components/communities/display/community-sidebar";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

export function CommunityThreads({ community, threads }: { community: Community; threads: Thread[] }) {
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityNavActions community={community} />
            <CommunityHeader community={community} />
            <CommunityThreadsList threads={threads} />
          </div>
          {/* Sidebar */}
          <div className="space-y-8 lg:pt-[54px]">
            <CommunitySidebar community={community} />
          </div>
        </div>
      </main>
    </>
  );
}
