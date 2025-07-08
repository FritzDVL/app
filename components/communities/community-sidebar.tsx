import { CommunityModerators } from "@/components/communities/community-moderators";
import { CommunityRules } from "@/components/communities/community-rules";
import { useCommunity } from "@/hooks/queries/use-community";

export function CommunitySidebar({ communityAddress }: { communityAddress: string }) {
  const { data: community, isLoading } = useCommunity(communityAddress);

  if (isLoading || !community) return null;

  return (
    <div className="space-y-8">
      <CommunityRules />
      <CommunityModerators moderators={community.moderators} />
    </div>
  );
}
