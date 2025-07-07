import { Card, CardContent, CardHeader } from "../ui/card";
import { Community } from "@/types/common";

type CommunitiesSidebarProps = {
  communities: Community[];
};

export function CommunitiesSidebar({ communities }: CommunitiesSidebarProps) {
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
            <span className="text-slate-600">Total Posts</span>
            <span className="font-bold text-purple-600">
              {communities.reduce((total, c) => total + (c.postCount || 0), 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {/* <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-4">
          <h3 className="font-semibold text-slate-900">Popular Categories</h3>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {Array.from(new Set(communities.map(c => c.category)))
            .slice(0, 5)
            .map(category => (
              <div key={category} className="flex items-center justify-between">
                <Badge variant="outline" className="border-brand-200 bg-brand-50 text-brand-600">
                  {category}
                </Badge>
                <span className="text-sm text-slate-500">
                  {communities.filter(c => c.category === category).length}
                </span>
              </div>
            ))}
        </CardContent>
      </Card> */}
    </div>
  );
}
