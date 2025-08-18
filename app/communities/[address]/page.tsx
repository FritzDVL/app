import { CommunityHeader } from "@/components/communities/community-header";
import { CommunitySidebar } from "@/components/communities/community-sidebar";
import { CommunityThreads } from "@/components/communities/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { getCommunity } from "@/lib/services/community/get-community";
import { getCommunityThreads } from "@/lib/services/thread/get-community-threads";

export default async function CommunityPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress);
  const community = communityResult.success ? communityResult.community : null;

  const threadsResult = await getCommunityThreads(communityAddress);
  const threads = threadsResult.success ? (threadsResult.threads ?? []) : [];

  if (!community) {
    return <div className="text-center text-red-500">Community not found</div>;
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityHeader community={community} />
            <CommunityThreads community={community} threads={threads} />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitySidebar community={community} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
