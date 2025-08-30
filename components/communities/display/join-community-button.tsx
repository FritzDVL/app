import { Button } from "@/components/ui/button";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { LogIn } from "lucide-react";

interface JoinCommunityButtonProps {
  community: Community;
  onStatusChange: () => void;
}

export function JoinCommunityButton({ community, onStatusChange }: JoinCommunityButtonProps) {
  const { isLoggedIn } = useAuthStore();
  const joinCommunity = useJoinCommunity(community);

  const handleJoin = async () => {
    try {
      const joined = await joinCommunity();
      if (joined) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const operations = community.group.operations;
  if (!operations) {
    return null;
  }

  const canJoin = operations.canJoin.__typename === "GroupOperationValidationPassed" && !operations.isBanned;
  if (!canJoin) {
    return null;
  }

  return (
    <Button
      disabled={!isLoggedIn}
      onClick={handleJoin}
      size="sm"
      variant="default"
      className="h-8 px-3 text-xs font-medium transition-all duration-150"
    >
      <LogIn className="mr-1.5 h-3 w-3" />
      <span className="hidden md:inline">Join</span>
      <span className="md:hidden">Join</span>
    </Button>
  );
}
