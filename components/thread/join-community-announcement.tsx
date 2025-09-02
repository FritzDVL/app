import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface JoinCommunityAnnouncementProps {
  isLoading: boolean;
  onJoinCommunity: () => void;
}

export function JoinCommunityAnnouncement({ isLoading, onJoinCommunity }: JoinCommunityAnnouncementProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-brand-800 dark:border-brand-900/30 dark:bg-brand-900/20 dark:text-brand-200">
      <span className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <span>Join this community to participate in the discussion!</span>
      </span>
      <Button
        size="sm"
        className="ml-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700"
        onClick={onJoinCommunity}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join Community"}
      </Button>
    </div>
  );
}
