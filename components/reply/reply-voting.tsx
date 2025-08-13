import { useVoting } from "../../hooks/common/use-voting";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { PostId } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ReplyVotingProps {
  postid: PostId;
  score: number;
}

const upvoteLabel = "Upvote";
const downvoteLabel = "Downvote";

export function ReplyVoting({ postid, score }: ReplyVotingProps) {
  const { hasUserUpvoted, hasUserDownvoted, isLoading, scoreState, handleUpvote, handleDownvote } = useVoting({
    postid,
    initialScore: score,
    upvoteLabel,
    downvoteLabel,
  });
  const { isLoggedIn } = useAuthStore();

  return (
    <div className={`flex flex-col items-center space-y-1`}>
      <Button
        variant={hasUserUpvoted ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full p-1 transition-all duration-300 hover:scale-110 hover:bg-green-100 hover:text-green-600 ${hasUserUpvoted ? "bg-green-100 text-green-600" : ""}`}
        onClick={handleUpvote}
        disabled={isLoading === "up" || isLoading === "down" || hasUserDownvoted || !isLoggedIn}
        aria-pressed={hasUserUpvoted}
        aria-label={upvoteLabel}
      >
        {isLoading === "up" ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm font-medium text-muted-foreground">{scoreState}</span>
      <Button
        variant={hasUserDownvoted ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full p-1 transition-all duration-300 hover:scale-110 hover:bg-red-100 hover:text-red-600 ${hasUserDownvoted ? "bg-red-100 text-red-600" : ""}`}
        onClick={handleDownvote}
        disabled={isLoading === "up" || isLoading === "down" || hasUserUpvoted || !isLoggedIn}
        aria-pressed={hasUserDownvoted}
        aria-label={downvoteLabel}
      >
        {isLoading === "down" ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
