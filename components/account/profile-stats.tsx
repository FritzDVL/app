import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  reputation: number;
  loading: boolean;
}

export function ProfileStats({ followers, following, posts, reputation, loading }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{followers}</div>
          <div className="text-sm text-slate-700">Followers</div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{following}</div>
          <div className="text-sm text-slate-700">Following</div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{loading ? "..." : posts}</div>
          <div className="text-sm text-slate-700">Posts</div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{reputation}</div>
          <div className="text-sm text-slate-700">Reputation</div>
        </CardContent>
      </Card>
    </div>
  );
}
