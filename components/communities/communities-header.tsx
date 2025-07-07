import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CommunitiesHeaderProps {
  total: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function CommunitiesHeader({ total, searchQuery, setSearchQuery }: CommunitiesHeaderProps) {
  return (
    <Card className="mb-8 rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-brand-300/30 bg-gradient-to-r from-brand-500/20 to-brand-400/20 px-3 py-1">
              <Users className="mr-2 h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">{total} Communities</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Communities</h1>
            <p className="mt-1 text-slate-600">Discover and join communities in the Lens ecosystem</p>
          </div>
          <Link href="/communities/new">
            <Button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-brand-600 hover:to-brand-700">
              Create Community
            </Button>
          </Link>
        </div>
        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <input
              className="rounded-full border-slate-300/60 bg-white pl-10 backdrop-blur-sm transition-all duration-300 focus:border-brand-400 focus:bg-white"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-slate-100"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
