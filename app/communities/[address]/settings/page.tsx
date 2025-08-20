import { CommunitySettingsClient } from "@/components/communities/settings/community-settings-client";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { getCommunity } from "@/lib/services/community/get-community";

export default async function CommunitySettingsPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: communityAddress } = await params;

  const communityResult = await getCommunity(communityAddress);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return <div className="text-center text-red-500">Community not found</div>;
  }

  return (
    <>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href={`/communities/${communityAddress}`}>Back to Community</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <CommunitySettingsClient community={community} />
      </main>
    </>
  );
}
