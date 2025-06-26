import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { addReaction, fetchPost, undoReaction } from "@lens-protocol/client/actions";
import { Post, PostReactionType, postId, useSessionClient } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

export function ThreadReplyActions({ postId: postid, score }: { postId: string; score: number }) {
  const [hasUserUpvoted, setHasUserUpvoted] = useState(false);
  const [hasUserDownvoted, setHasUserDownvoted] = useState(false);
  const [loading, setLoading] = useState<"up" | "down" | null>(null);
  const [scoreState, setScoreState] = useState(score);
  const sessionClient = useSessionClient();

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

  const handleVote = async (
    type: "up" | "down",
    reactionType: PostReactionType,
    hasUserReacted: boolean,
    setHasUserReacted: (v: boolean) => void,
  ) => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: `Please log in to ${type === "up" ? "upvote" : "downvote"} posts.`,
      });
      return;
    }
    setLoading(type);
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
        setScoreState(prev => prev + (type === "up" ? -1 : 1));
        toast.success(type === "up" ? "Upvote removed" : "Downvote removed");
      } catch {
        toast.error(type === "up" ? "Failed to remove upvote." : "Failed to remove downvote.");
        toast.dismiss(removingToastId);
      } finally {
        setLoading(null);
      }
      return;
    }
    // Add reaction
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
      setScoreState(prev => prev + (type === "up" ? 1 : -1));
      toast.success(type === "up" ? "Upvoted!" : "Downvoted!");
    } catch {
      toast.error(type === "up" ? "Failed to upvote. Please try again." : "Failed to downvote. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleUpvote = () => handleVote("up", PostReactionType.Upvote, hasUserUpvoted, setHasUserUpvoted);
  const handleDownvote = () => handleVote("down", PostReactionType.Downvote, hasUserDownvoted, setHasUserDownvoted);

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant={hasUserUpvoted ? "secondary" : "ghost"}
        size="sm"
        className={`rounded-full p-1 hover:bg-green-100 hover:text-green-600 ${hasUserUpvoted ? "bg-green-100 text-green-600" : ""}`}
        onClick={handleUpvote}
        disabled={loading === "up" || loading === "down" || hasUserDownvoted}
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
        disabled={loading === "up" || loading === "down" || hasUserUpvoted}
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
