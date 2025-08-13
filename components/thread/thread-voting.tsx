import { useVoting } from "@/components/shared/use-voting";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { PostId } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ThreadVotingProps {
  postid: PostId;
  score: number;
  className?: string;
}

export function ThreadVoting({ postid, score, className }: ThreadVotingProps) {
  const { hasUserUpvoted, hasUserDownvoted, isLoading, scoreState, handleUpvote, handleDownvote } = useVoting({
    postid,
    initialScore: score,
  });

  const { isLoggedIn } = useAuthStore();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gray-300/60 bg-white/80 px-2 py-1 shadow-md shadow-gray-200/60 backdrop-blur-sm dark:border-gray-600/60 dark:bg-gray-800/80 dark:shadow-gray-900/40 ${className || ""}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`h-7 w-7 rounded-full p-0 transition-all duration-200 hover:scale-110 hover:shadow-sm ${
          hasUserUpvoted
            ? "bg-green-100 text-green-600 shadow-sm hover:bg-green-200"
            : "hover:bg-green-50 hover:text-green-600"
        }`}
        onClick={handleUpvote}
        disabled={isLoading === "up" || isLoading === "down" || hasUserDownvoted || !isLoggedIn}
        aria-pressed={hasUserUpvoted}
        aria-label="Upvote thread"
      >
        {isLoading === "up" ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-green-600 border-t-transparent" />
        ) : (
          <ArrowUp className="h-3.5 w-3.5" />
        )}
      </Button>

      <span className="mx-1 min-w-[1.5rem] text-center text-sm font-semibold text-foreground">{scoreState}</span>

      <Button
        variant="ghost"
        size="sm"
        className={`h-7 w-7 rounded-full p-0 transition-all duration-200 hover:scale-110 hover:shadow-sm ${
          hasUserDownvoted ? "bg-red-100 text-red-600 shadow-sm hover:bg-red-200" : "hover:bg-red-50 hover:text-red-600"
        }`}
        onClick={handleDownvote}
        disabled={isLoading === "up" || isLoading === "down" || hasUserUpvoted || !isLoggedIn}
        aria-pressed={hasUserDownvoted}
        aria-label="Downvote thread"
      >
        {isLoading === "down" ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
