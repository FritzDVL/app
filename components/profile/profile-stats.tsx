interface ProfileStatsProps {
  posts: number;
}

export function ProfileStats({ posts }: ProfileStatsProps) {
  // Mock data for now to match Discourse style
  const stats = [
    { label: "days visited", value: "12" },
    { label: "read time", value: "34m" },
    { label: "recent read time", value: "1m" },
    { label: "topics viewed", value: "14" },
    { label: "posts read", value: "47" },
    { label: "given", value: "0", icon: "❤️" },
    { label: "received", value: "0", icon: "❤️" },
    { label: "topics created", value: Math.floor(posts / 5).toString() },
    { label: "posts created", value: posts.toString() },
  ];

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">Stats</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 dark:text-gray-300">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-1">
            <span className="font-bold text-slate-900 dark:text-white">{stat.value}</span>
            {stat.icon && <span className="text-pink-500">{stat.icon}</span>}
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
