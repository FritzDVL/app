import { MessageCircle, Sparkles, Users } from "lucide-react";

interface StatsBarProps {
  loadingStats: boolean;
  statsError: boolean;
  forumStats?: {
    members?: number;
    threads?: number;
    communities?: number;
  };
}

export function StatsBar({ loadingStats, statsError, forumStats }: StatsBarProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300/60">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 rounded-full bg-blue-100 p-2 transition-all group-hover:bg-blue-200">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mb-1 text-xs text-slate-600">Total Members</p>
          <p className="text-lg font-bold text-slate-900">
            {loadingStats ? (
              <span className="animate-pulse text-slate-400">...</span>
            ) : statsError ? (
              <span className="text-red-500">!</span>
            ) : (
              (forumStats?.members?.toLocaleString() ?? 0)
            )}
          </p>
        </div>
      </div>
      <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-green-300/60">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 rounded-full bg-green-100 p-2 transition-all group-hover:bg-green-200">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="mb-1 text-xs text-slate-600">Active Threads</p>
          <p className="text-lg font-bold text-slate-900">
            {loadingStats ? (
              <span className="animate-pulse text-slate-400">...</span>
            ) : statsError ? (
              <span className="text-red-500">!</span>
            ) : (
              (forumStats?.threads?.toLocaleString() ?? 0)
            )}
          </p>
        </div>
      </div>
      <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-300/60">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 rounded-full bg-amber-100 p-2 transition-all group-hover:bg-amber-200">
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mb-1 text-xs text-slate-600">Communities</p>
          <p className="text-lg font-bold text-slate-900">
            {loadingStats ? (
              <span className="animate-pulse text-slate-400">...</span>
            ) : statsError ? (
              <span className="text-red-500">!</span>
            ) : (
              (forumStats?.communities?.toLocaleString() ?? 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
