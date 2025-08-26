import { CommunityModerators } from "@/components/communities/community-moderators";
import { CommunityOwner } from "@/components/communities/community-owner";
import { CommunityRules } from "@/components/communities/community-rules";
import { Community } from "@/lib/domain/communities/types";

export function CommunitySidebar({ community }: { community: Community }) {
  if (!community) return null;

  return (
    <div className="space-y-8">
      <CommunityOwner owner={community.owner} />
      <CommunityModerators moderators={community.moderators} />
      <CommunityRules />
    </div>
  );
}
