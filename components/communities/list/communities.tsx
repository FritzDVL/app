import { Suspense } from "react";
import { CommunitiesHeader } from "@/components/communities/list/communities-header";
import { CommunitiesList } from "@/components/communities/list/communities-list";
import { CommunitiesStats } from "@/components/communities/list/communities-stats";
import { Community } from "@/lib/domain/communities/types";

interface CommunitiesProps {
  communities: Community[];
}

export function Communities({ communities }: CommunitiesProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <CommunitiesHeader total={communities.length} />
          <Suspense fallback={<div className="h-32 w-full animate-pulse rounded-xl bg-muted" />}>
            <CommunitiesList initialCommunities={communities} isLoading={false} isError={false} error={null} />
          </Suspense>
        </div>
        {/* Sidebar */}
        <div className="space-y-8">
          <Suspense fallback={<div className="h-32 w-full animate-pulse rounded-xl bg-muted" />}>
            <CommunitiesStats communities={communities} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
