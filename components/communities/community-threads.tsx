import { CommunityHeader } from "@/components/communities//community-header";
import { CommunitySidebar } from "@/components/communities/community-sidebar";
import { CommunityThreadsList } from "@/components/communities/community-threads-list";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";

export function CommunityThreads({ community, threads }: { community: Community; threads: Thread[] }) {
  return (
    <>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityHeader community={community} />
            <CommunityThreadsList threads={threads} />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitySidebar community={community} />
          </div>
        </div>
      </main>
    </>
  );
}
