"use client";

import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { ReplySharedCard } from "@/components/reply/reply-shared-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useReply } from "@/hooks/queries/use-reply";

export default function ReplyPage() {
  const params = useParams();
  const { replyId } = params;

  // Fetch reply and thread data
  const { data: reply, isLoading: replyLoading } = useReply(replyId as string);

  if (replyLoading) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          <LoadingSpinner text="Loading reply..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (!reply) {
    return (
      <ProtectedRoute>
        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          <StatusBanner
            type="info"
            title="Reply Not Found"
            message="The reply you're looking for doesn't exist or has been removed."
          />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Reply Context: Who is answering to */}
        {reply.post.commentOn && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Replying to</h3>
            <ReplySharedCard reply={reply.post.commentOn} />
          </div>
        )}

        {/* Featured Reply */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Reply</h2>

          {/* Reply with enhanced border and shadow */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-200 to-brand-300 opacity-20 blur-sm dark:from-brand-600 dark:to-brand-700"></div>
            <div className="relative rounded-lg border-2 border-brand-200 bg-white shadow-lg dark:border-brand-600 dark:bg-gray-800">
              <ReplySharedCard reply={reply.post} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
