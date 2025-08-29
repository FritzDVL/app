import { CommunityOwner } from "@/components/communities/display/community-owner";
import { CommunityModerators } from "@/components/communities/display/community-moderators";
import { RulesGuidelines } from "@/components/shared/rules-guidelines";
import { Community } from "@/lib/domain/communities/types";

export function CommunitySidebar({ community }: { community: Community }) {
  if (!community) return null;

  return (
    <div className="space-y-8">
      <CommunityOwner owner={community.owner} />
      <CommunityModerators moderators={community.moderators} />
      <RulesGuidelines />
    </div>
  );
}
