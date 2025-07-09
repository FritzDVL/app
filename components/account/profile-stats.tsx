import { FileText, ShieldCheck, UserPlus, Users } from "lucide-react";

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  reputation: number;
  loading: boolean;
}

export function ProfileStats({ followers, following, posts, reputation, loading }: ProfileStatsProps) {
  const stats = [
    {
      label: "Followers",
      value: followers,
      icon: <Users className="h-4 w-4 text-brand-500" />,
    },
    {
      label: "Following",
      value: following,
      icon: <UserPlus className="h-4 w-4 text-brand-500" />,
    },
    {
      label: "Posts",
      value: loading ? "..." : posts,
      icon: <FileText className="h-4 w-4 text-brand-500" />,
    },
    {
      label: "Reputation",
      value: reputation,
      icon: <ShieldCheck className="h-4 w-4 text-brand-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {stats.map(stat => (
        <div key={stat.label} className="rounded-2xl border border-slate-300/60 bg-white p-3 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 flex items-center justify-center">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
            <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
