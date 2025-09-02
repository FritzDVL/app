import { Button } from "@/components/ui/button";
import { useJoinCommunity } from "@/hooks/communities/use-join-community";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { LogIn, ShieldX } from "lucide-react";

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

  if (operations.isBanned) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
        <ShieldX className="h-4 w-4 flex-shrink-0" />
        <span className="hidden md:inline">Banned from community</span>
        <span className="md:hidden">Banned</span>
      </div>
    );
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
