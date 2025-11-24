import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, Heart, MessageSquare, ThumbsUp, Users } from "lucide-react";

interface ProfileStatsProps {
  followers: number;
  posts: number;
}

export function ProfileStats({ followers, posts }: ProfileStatsProps) {
  // Mock data for now to match Discourse style
  const stats = [
    {
      label: "Days Visited",
      value: "14",
      icon: CalendarIcon,
    },
    {
      label: "Read Time",
      value: "2h",
      icon: Clock,
    },
    {
      label: "Recent Read Time",
      value: "30m",
      icon: Eye,
    },
    {
      label: "Topics Created",
      value: Math.floor(posts / 5).toString(), // Mock ratio
      icon: MessageSquare,
    },
    {
      label: "Posts Created",
      value: posts.toString(),
      icon: MessageSquare,
    },
    {
      label: "Likes Given",
      value: "12",
      icon: Heart,
    },
    {
      label: "Likes Received",
      value: "45",
      icon: ThumbsUp,
    },
    {
      label: "Followers",
      value: followers.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
            <span className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
