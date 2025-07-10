import { Card, CardContent, CardHeader } from "../ui/card";
import { Community } from "@/types/common";

type CommunitiesStatsProps = {
  communities: Community[];
};

export function CommunitiesStats({ communities }: CommunitiesStatsProps) {
  return (
    <div className="space-y-8">
      {/* Community Stats */}
      <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
        <CardHeader className="pb-4">
          <h3 className="font-semibold text-slate-900">Community Stats</h3>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center justify-between rounded-2xl bg-blue-50/70 p-3">
            <span className="text-slate-600">Total Communities</span>
            <span className="font-bold text-blue-600">{communities.length}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-green-50/70 p-3">
            <span className="text-slate-600">Active Members</span>
            <span className="font-bold text-green-600">
              {communities.reduce((total, c) => total + c.memberCount, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-purple-50/70 p-3">
            <span className="text-slate-600">Total Threads</span>
            <span className="font-bold text-purple-600">
              {communities.reduce((total, c) => total + c.threadsCount, 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
