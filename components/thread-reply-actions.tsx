import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addReaction } from "@lens-protocol/client/actions";
import { PostReactionType, postId, useSessionClient } from "@lens-protocol/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

export function ThreadReplyActions({ postId: postid, score }: { postId: string; score: number }) {
  const [loading, setLoading] = useState<"up" | "down" | null>(null);
  const sessionClient = useSessionClient();

  // Generalized handler for voting
  const handleVote = async (
    type: "up" | "down",
    reactionType: PostReactionType,
    successMsg: string,
    failMsg: string,
  ) => {
    if (!sessionClient.data) {
      toast.error("Not logged in", {
        description: `Please log in to ${type === "up" ? "upvote" : "downvote"} posts.`,
      });
      return;
    }
    setLoading(type);
    const loadingToastId = toast.loading(type === "up" ? "Upvoting..." : "Downvoting...");
    try {
      const result = await addReaction(sessionClient.data, {
        post: postId(postid),
        reaction: reactionType,
      });
      if (result.isErr()) {
        toast.dismiss(loadingToastId);
        return console.error(result.error);
      }
      toast.success(successMsg);
    } catch {
      toast.error(failMsg);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(null);
    }
  };

  const handleUpvote = () =>
    handleVote("up", PostReactionType.Upvote, "Upvoted!", "Failed to upvote. Please try again.");
  const handleDownvote = () =>
    handleVote("down", PostReactionType.Downvote, "Downvoted!", "Failed to downvote. Please try again.");

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-1 hover:bg-green-100 hover:text-green-600"
        onClick={handleUpvote}
        disabled={loading === "up" || loading === "down"}
      >
        {loading === "up" ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm font-medium text-gray-600">{score}</span>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-1 hover:bg-red-100 hover:text-red-600"
        onClick={handleDownvote}
        disabled={loading === "up" || loading === "down"}
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
