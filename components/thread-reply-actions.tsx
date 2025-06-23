import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ThreadReplyActions({
  score,
  onUpvote,
  onDownvote,
}: {
  score: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-1 hover:bg-green-100 hover:text-green-600"
        onClick={onUpvote}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-gray-600">{score}</span>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-1 hover:bg-red-100 hover:text-red-600"
        onClick={onDownvote}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
