import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, X } from "lucide-react";

interface CommunitiesHeaderProps {
  total: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function CommunitiesHeader({ total, searchQuery, setSearchQuery }: CommunitiesHeaderProps) {
  return (
    <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardContent className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-brand-300/30 bg-gradient-to-r from-brand-500/20 to-brand-400/20 px-3 py-1">
              <Users className="mr-2 h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-slate-900 dark:text-gray-100">{total} Communities</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Communities</h1>
            <p className="mt-1 text-muted-foreground">Discover and join communities in the Lens ecosystem</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-background focus:shadow-md focus:shadow-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
