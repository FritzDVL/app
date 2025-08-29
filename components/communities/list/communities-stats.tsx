import { Card, CardContent, CardHeader } from "../../ui/card";
import { Community } from "@/lib/domain/communities/types";

type CommunitiesStatsProps = {
  communities: Community[];
};

export function CommunitiesStats({ communities }: CommunitiesStatsProps) {
  return (
    <div className="space-y-8">
      {/* Community Stats */}
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardHeader className="pb-4">
          <h3 className="text-2xl font-semibold text-foreground">Community Stats</h3>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-3 dark:bg-gray-500">
            <span className="text-slate-700">Total Communities</span>
            <span className="font-bold text-brand-700 dark:text-brand-300">{communities.length}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-gray-500">
            <span className="text-slate-700">Active Members</span>
            <span className="font-bold text-brand-700 dark:text-brand-300">
              {communities.reduce((total, c) => total + c.memberCount, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-gray-500">
            <span className="text-slate-700">Total Threads</span>
            <span className="font-bold text-brand-700 dark:text-brand-300">
              {communities.reduce((total, c) => total + c.threadsCount, 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
