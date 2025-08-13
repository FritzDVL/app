import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { addReaction, fetchPost, undoReaction } from "@lens-protocol/client/actions";
import { Post, PostId, PostReactionType, postId as toPostId, useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";

interface UseVotingOptions {
  postid: PostId;
  initialScore: number;
  upvoteLabel?: string;
  downvoteLabel?: string;
}

export function useVoting({
  postid,
  initialScore,
  upvoteLabel = "Upvote",
  downvoteLabel = "Downvote",
}: UseVotingOptions) {
  const [hasUserUpvoted, setHasUserUpvoted] = useState(false);
  const [hasUserDownvoted, setHasUserDownvoted] = useState(false);
  const [isLoading, setIsLoading] = useState<"up" | "down" | null>(null);
  const [scoreState, setScoreState] = useState(initialScore);

  const sessionClient = useSessionClient();

  useEffect(() => {
    setScoreState(initialScore);
    const checkReactions = async () => {
      if (!sessionClient.data) return;
      try {
        const postResult = await fetchPost(sessionClient.data, { post: toPostId(postid) });
        if (postResult.isErr()) {
          console.error("Failed to fetch post reactions:", postResult.error);
          return;
        }
        const fetchedPost = postResult.value as Post;
        setHasUserUpvoted(!!fetchedPost.operations?.hasUpvoted);
        setHasUserDownvoted(!!fetchedPost.operations?.hasDownvoted);
      } catch (error) {
        console.error("Error checking reactions:", error);
      }
    };
    checkReactions();
  }, [sessionClient.data, postid, initialScore]);

  const handleVote = useCallback(
    async (
      type: "up" | "down",
      reactionType: PostReactionType,
      hasUserReacted: boolean,
      setHasUserReacted: (v: boolean) => void,
    ) => {
      if (!sessionClient.data) {
        toast.error("Not logged in", {
          description: `Please log in to ${type === "up" ? upvoteLabel.toLowerCase() : downvoteLabel.toLowerCase()} posts.`,
        });
        return;
      }
      setIsLoading(type);
      if (hasUserReacted) {
        const removingToastId = toast.loading(
          type === "up" ? `Removing ${upvoteLabel.toLowerCase()}...` : `Removing ${downvoteLabel.toLowerCase()}...`,
        );
        try {
          const result = await undoReaction(sessionClient.data, {
            post: toPostId(postid),
            reaction: reactionType,
          });
          toast.dismiss(removingToastId);
          if (result.isErr()) {
            setIsLoading(null);
            return console.error(result.error);
          }
          setHasUserReacted(false);
          setScoreState(prev => prev + (type === "up" ? -1 : 1));
          toast.success(type === "up" ? `${upvoteLabel} removed` : `${downvoteLabel} removed`);
        } catch {
          toast.error(
            type === "up"
              ? `Failed to remove ${upvoteLabel.toLowerCase()}.`
              : `Failed to remove ${downvoteLabel.toLowerCase()}.`,
          );
          toast.dismiss(removingToastId);
        } finally {
          setIsLoading(null);
        }
        return;
      }
      // Add reaction
      const votingToastId = toast.loading(type === "up" ? `${upvoteLabel}...` : `${downvoteLabel}...`);
      try {
        const result = await addReaction(sessionClient.data, {
          post: toPostId(postid),
          reaction: reactionType,
        });
        toast.dismiss(votingToastId);
        if (result.isErr()) {
          setIsLoading(null);
          return console.error(result.error);
        }
        setHasUserReacted(true);
        setScoreState(prev => prev + (type === "up" ? 1 : -1));
        toast.success(type === "up" ? `${upvoteLabel}d!` : `${downvoteLabel}d!`);
      } catch {
        toast.error(
          type === "up"
            ? `Failed to ${upvoteLabel.toLowerCase()}. Please try again.`
            : `Failed to ${downvoteLabel.toLowerCase()}. Please try again.`,
        );
      } finally {
        setIsLoading(null);
      }
    },
    [sessionClient.data, postid, upvoteLabel, downvoteLabel],
  );

  const handleUpvote = useCallback(
    () => handleVote("up", PostReactionType.Upvote, hasUserUpvoted, setHasUserUpvoted),
    [handleVote, hasUserUpvoted],
  );
  const handleDownvote = useCallback(
    () => handleVote("down", PostReactionType.Downvote, hasUserDownvoted, setHasUserDownvoted),
    [handleVote, hasUserDownvoted],
  );

  return {
    hasUserUpvoted,
    hasUserDownvoted,
    isLoading,
    scoreState,
    handleUpvote,
    handleDownvote,
  };
}
