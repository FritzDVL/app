"use client";

import { useState } from "react";
import { CommunitiesHeader } from "@/components/communities/communities-header";
import { CommunitiesList } from "@/components/communities/communities-list";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { useCommunities } from "@/hooks/queries/use-communities";
import { CommunitiesSidebar } from "@/components/communities/communities-sidebar";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: communities = [], isLoading, isError, error } = useCommunities();

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunitiesHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              total={communities.length}
            />
            <CommunitiesList
              searchQuery={searchQuery}
              communities={communities.map((c) => ({ ...c, logo: c.logo ?? undefined }))}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitiesSidebar communities={communities}/>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
