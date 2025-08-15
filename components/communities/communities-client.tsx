"use client";

import { useEffect, useMemo, useState } from "react";
import { CommunitiesHeader } from "@/components/communities/communities-header";
import { CommunitiesList } from "@/components/communities/communities-list";
import { CommunitiesStats } from "@/components/communities/communities-stats";
import { Community } from "@/lib/domain/communities/types";

interface CommunitiesClientProps {
  initialCommunities: Community[];
}

export function CommunitiesClient({ initialCommunities }: CommunitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [communities] = useState(initialCommunities);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredCommunities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return communities;
    const query = debouncedSearchQuery.toLowerCase().trim();
    return communities.filter(
      (community: any) =>
        community.name.toLowerCase().includes(query) ||
        (community.description && community.description.toLowerCase().includes(query)),
    );
  }, [communities, debouncedSearchQuery]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <CommunitiesHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            total={debouncedSearchQuery ? filteredCommunities.length : communities.length}
          />
          <CommunitiesList
            searchQuery={debouncedSearchQuery}
            communities={filteredCommunities.map((c: any) => ({ ...c, logo: c.logo ?? undefined }))}
            isLoading={false}
            isError={false}
            error={null}
          />
        </div>
        {/* Sidebar */}
        <div className="space-y-8">
          <CommunitiesStats communities={communities} />
        </div>
      </div>
    </main>
  );
}
