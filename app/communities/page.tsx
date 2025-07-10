"use client";

import { useEffect, useMemo, useState } from "react";
import { CommunitiesHeader } from "@/components/communities/communities-header";
import { CommunitiesList } from "@/components/communities/communities-list";
import { CommunitiesStats } from "@/components/communities/communities-stats";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { useCommunities } from "@/hooks/queries/use-communities";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { data: communities = [], isLoading, isError, error } = useCommunities();

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter communities based on debounced search query
  const filteredCommunities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return communities;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    return communities.filter(
      community => community.name.toLowerCase().includes(query) || community.description.toLowerCase().includes(query),
    );
  }, [communities, debouncedSearchQuery]);

  return (
    <ProtectedRoute>
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
              communities={filteredCommunities.map(c => ({ ...c, logo: c.logo ?? undefined }))}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitiesStats communities={communities} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
