import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ThreadVotingProps {
  votes: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
  className?: string;
}

export const ThreadVoting: React.FC<ThreadVotingProps> = ({ votes, onUpvote, onDownvote, className }) => (
  <div className={`flex min-w-[50px] flex-col items-center space-y-1 ${className || ""}`}>
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full p-1 transition-colors hover:bg-brand-50 hover:text-brand-600"
      onClick={onUpvote}
      aria-label="Upvote"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
    <span className="text-sm font-medium text-slate-600">{votes}</span>
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full p-1 transition-colors hover:bg-red-50 hover:text-red-600"
      onClick={onDownvote}
      aria-label="Downvote"
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  </div>
);
