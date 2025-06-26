import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { addReaction, fetchPost, undoReaction } from "@lens-protocol/client/actions";
import { Post, PostReactionType, postId, useSessionClient } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

export function ThreadReplyActions({ postId: postid, score }: { postId: string; score: number }) {
  // State
  const [hasUserUpvoted, setHasUserUpvoted] = useState(false);
  const [hasUserDownvoted, setHasUserDownvoted] = useState(false);
  const [loading, setLoading] = useState<"up" | "down" | null>(null);
  const [scoreState, setScoreState] = useState(score);
  const sessionClient = useSessionClient();

  // Fetch user reaction state and sync score on mount/prop change
  useEffect(() => {
    setScoreState(score);
    const checkReactions = async () => {
      if (!sessionClient.data) return;
      try {
        const postResult = await fetchPost(sessionClient.data, { post: postId(postid) });
        if (postResult.isErr()) {
          console.error("Failed to fetch post reactions:", postResult.error);
          return;
        }
        const post = postResult.value as Post;
        setHasUserUpvoted(!!post.operations?.hasUpvoted);
        setHasUserDownvoted(!!post.operations?.hasDownvoted);
      } catch (error) {
        console.error("Error checking reactions:", error);
      }
    };
    checkReactions();
  }, [sessionClient.data, postid, score]);

  // Generalized handler for voting and toggling reactions
  const handleVote = async (
    type: "up" | "down",
    reactionType: PostReactionType,
    hasUserReacted: boolean,
    setHasUserReacted: (v: boolean) => void,
    oppositeHasUserReacted: boolean,
    setOppositeHasUserReacted: (v: boolean) => void,
  ) => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: `Please log in to ${type === "up" ? "upvote" : "downvote"} posts.`,
      });
      return;
    }
    setLoading(type);
    // If user has the opposite reaction, remove it first
    if (oppositeHasUserReacted) {
      const switchingToastId = toast.loading(type === "up" ? "Switching to upvote..." : "Switching to downvote...");
      try {
        const result = await undoReaction(sessionClient.data, {
          post: postId(postid),
          reaction: type === "up" ? PostReactionType.Downvote : PostReactionType.Upvote,
        });
        toast.dismiss(switchingToastId);
        if (result.isErr()) {
          setLoading(null);
          return console.error(result.error);
        }
        setOppositeHasUserReacted(false);
        setScoreState(prev => prev + (type === "up" ? 1 : -1));
      } catch {
        toast.error("Failed to switch vote. Please try again.");
        toast.dismiss(switchingToastId);
        setLoading(null);
        return;
      }
    }
    // If user already reacted, undo
    if (hasUserReacted) {
      const removingToastId = toast.loading(type === "up" ? "Removing upvote..." : "Removing downvote...");
      try {
        const result = await undoReaction(sessionClient.data, {
          post: postId(postid),
          reaction: reactionType,
        });
        toast.dismiss(removingToastId);
        if (result.isErr()) {
          setLoading(null);
          return console.error(result.error);
        }
        setHasUserReacted(false);
        setScoreState(prev => prev - 1);
        toast.success(type === "up" ? "Upvote removed" : "Downvote removed");
        setLoading(null);
        return;
      } catch {
        toast.error(type === "up" ? "Failed to remove upvote." : "Failed to remove downvote.");
        toast.dismiss(removingToastId);
        setLoading(null);
        return;
      }
    }
    // Otherwise, add reaction
    const votingToastId = toast.loading(type === "up" ? "Upvoting..." : "Downvoting...");
    try {
      const result = await addReaction(sessionClient.data, {
        post: postId(postid),
        reaction: reactionType,
      });
      toast.dismiss(votingToastId);
      if (result.isErr()) {
        setLoading(null);
        return console.error(result.error);
      }
      setHasUserReacted(true);
      setScoreState(prev => prev + 1);
      toast.success(type === "up" ? "Upvoted!" : "Downvoted!");
    } catch {
      toast.error(type === "up" ? "Failed to upvote. Please try again." : "Failed to downvote. Please try again.");
    } finally {
      toast.dismiss(votingToastId);
      setLoading(null);
    }
  };

  // Button handlers
  const handleUpvote = () =>
    handleVote("up", PostReactionType.Upvote, hasUserUpvoted, setHasUserUpvoted, hasUserDownvoted, setHasUserDownvoted);
  const handleDownvote = () =>
    handleVote(
      "down",
      PostReactionType.Downvote,
      hasUserDownvoted,
      setHasUserDownvoted,
      hasUserUpvoted,
      setHasUserUpvoted,
    );

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant={hasUserUpvoted ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full p-1 hover:bg-green-100 hover:text-green-600 ${hasUserUpvoted ? "bg-green-100 text-green-600" : ""}`}
        onClick={handleUpvote}
        disabled={loading === "up" || loading === "down"}
        aria-pressed={hasUserUpvoted}
      >
        {loading === "up" ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm font-medium text-gray-600">{scoreState}</span>
      <Button
        variant={hasUserDownvoted ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full p-1 hover:bg-red-100 hover:text-red-600 ${hasUserDownvoted ? "bg-red-100 text-red-600" : ""}`}
        onClick={handleDownvote}
        disabled={loading === "up" || loading === "down"}
        aria-pressed={hasUserDownvoted}
      >
        {loading === "down" ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
