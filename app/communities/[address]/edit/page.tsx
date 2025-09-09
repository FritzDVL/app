import { CommunitySettingsClient } from "@/components/communities/settings/community-settings-client";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { getCommunity } from "@/lib/services/community/get-community";
import { Address } from "@/types/common";

export default async function CommunitySettingsPage({ params }: { params: { address: string } }) {
  const communityAddress = params.address;
  const communityResult = await getCommunity(communityAddress as Address);
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
