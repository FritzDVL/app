import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface RecentActivityProps {
  replies: any[];
  loading: boolean;
}

export function RecentActivity({ replies, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading recent activity...</div>
      </div>
    );
  }
  if (replies.length > 0) {
    return (
      <div className="space-y-3">
        {replies.map((reply: any) => (
          <div
            key={reply.id}
            className="group relative rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm"
          >
            <div className="space-y-3">
              <div className="rich-text-content text-slate-700">
                <div dangerouslySetInnerHTML={{ __html: reply.content }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-slate-500">
                  <span className="flex items-center space-x-1">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span>{reply.upvotes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg
                      className="h-4 w-4 rotate-180 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span>{reply.downvotes || 0}</span>
                  </span>
                  <span className="text-slate-400">
                    {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                {reply.thread && (
                  <Link
                    href={`/thread/${reply.thread}`}
                    className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                  >
                    View Thread
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MessageCircle className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="mb-2 text-lg font-medium text-slate-900">No recent activity</h3>
      <p className="text-slate-500">Posts and replies will appear here</p>
    </div>
  );
}
