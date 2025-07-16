import React from "react";
import { LensReputationLogo } from "../assets/lensreputation-logo";
import { FileText, UserPlus, Users } from "lucide-react";

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
      icon: <LensReputationLogo size={16} />, // Use the LensReputation logo here
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-300/60 bg-white p-3 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 flex items-center justify-center">
              {stat.label === "Reputation" ? (
                <span className="mr-2">
                  <LensReputationLogo size={28} />
                </span>
              ) : (
                <span className="mr-2">{React.cloneElement(stat.icon, { className: "h-7 w-7 text-brand-500" })}</span>
              )}
              <span className="text-2xl font-extrabold text-foreground">{stat.value}</span>
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
