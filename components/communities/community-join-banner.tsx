import { Button } from "@/components/ui/button";
import { useCommunityMembership } from "@/hooks/communities/use-community-membership";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/types/common";
import { Plus, Users } from "lucide-react";

interface CommunityJoinBannerProps {
  community: Community;
}

export function CommunityJoinBanner({ community }: CommunityJoinBannerProps) {
  const { isMember, isLoading, updateIsMember } = useCommunityMembership(community.address);
  const join = useJoinCommunity(community);

  const handleJoin = async () => {
    await join();
    updateIsMember(true);
  };

  // Don't show banner if user is already a member or data is loading
  if (isLoading || isMember) {
    return null;
  }

  return (
    <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/10 to-brand-600/10 ring-2 ring-brand-200/50">
            <Users className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Join {community.name}</h3>
            <p className="text-sm text-muted-foreground">
              Join this community to participate in discussions and stay updated
            </p>
          </div>
        </div>
        <Button
          onClick={handleJoin}
          size="sm"
          className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Join Community
        </Button>
      </div>
    </div>
  );
}
