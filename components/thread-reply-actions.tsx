import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";

export function ThreadReplyActions({ postId, score }: { postId: string; score: number }) {
  const [loading, setLoading] = useState<"up" | "down" | null>(null);

  // Handler for upvote button
  const handleUpvote = async () => {
    setLoading("up");
    try {
      // Simulate network delay for animation
      await new Promise(resolve => setTimeout(resolve, 900));
      // TODO: Add logic to record upvote reaction for postId
      // await upvotePost(postId);
      toast.success("Upvoted!");
    } catch {
      toast.error("Failed to upvote. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Handler for downvote button
  const handleDownvote = async () => {
    setLoading("down");
    try {
      // Simulate network delay for animation
      await new Promise(resolve => setTimeout(resolve, 900));
      // TODO: Add logic to record downvote reaction for postId
      // await downvotePost(postId);
      toast.success("Downvoted!");
    } catch {
      toast.error("Failed to downvote. Please try again.");
    } finally {
      setLoading(null);
    }
  };

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
