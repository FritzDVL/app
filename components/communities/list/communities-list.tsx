"use client";

import { useState } from "react";
import { CommunityCard } from "@/components/communities/list/community-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Community } from "@/lib/domain/communities/types";
import { getCommunitiesPaginated } from "@/lib/services/community/get-communities-paginated";
import { COMMUNITIES_PER_PAGE } from "@/lib/shared/constants";
import { Users } from "lucide-react";

interface CommunitiesListProps {
  initialCommunities: Community[];
}

export function CommunitiesList({ initialCommunities }: CommunitiesListProps) {
  // Client state for search
  // const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);

  // const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedSearchQuery(searchQuery);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [searchQuery]);

  // const filteredCommunities = useMemo(() => {
  //   if (!debouncedSearchQuery.trim()) return initialCommunities;
  //   const query = debouncedSearchQuery.toLowerCase().trim();
  //   return initialCommunities.filter(
  //     (community: Community) =>
  //       community.name.toLowerCase().includes(query) ||
  //       (community.group.metadata?.description && community.group.metadata.description.toLowerCase().includes(query)),
  //   );
  // }, [initialCommunities, debouncedSearchQuery]);

  // Use paginated communities for rendering
  const filteredCommunities = communities;

  // Fetch communities for a given page
  const fetchPage = async (newPage: number) => {
    setLoadingPage(true);
    const result = await getCommunitiesPaginated({
      sort: { by: "memberCount", order: "desc" },
      limit: COMMUNITIES_PER_PAGE,
      offset: (newPage - 1) * COMMUNITIES_PER_PAGE,
    });
    setCommunities(result.success ? (result.communities ?? []) : []);
    setPage(newPage);
    setLoadingPage(false);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  };
  const handleNextPage = () => {
    fetchPage(page + 1);
  };

  const hasPrev = page > 1;
  const hasNext = communities.length === COMMUNITIES_PER_PAGE;

  return (
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-800 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-2xl font-bold text-foreground">
              <Users className="mr-3 h-6 w-6 text-brand-500" />
              All Communities
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            Discover and join communities to share ideas, collaborate, and connect with others who share your interests.
          </p>
          {/* Search Bar */}
          {/* <div className="mt-6">
            <div className="relative max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground backdrop-blur-sm transition-all duration-300 focus:border-primary/60 focus:bg-background focus:shadow-md focus:shadow-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <>
          {/* {searchQuery && (
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
              <Search className="h-4 w-4" />
              <span>
                Found {filteredCommunities.length} communit
                {filteredCommunities.length === 1 ? "y" : "ies"}
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>
          )} */}
          {filteredCommunities.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <StatusBanner
              type="info"
              title="No communities found"
              message="Try adjusting your search or create a new community to get started."
              icon={<Users className="h-10 w-10 text-slate-400" />}
            />
          )}
        </>
        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={undefined}
                  className={`${!hasPrev || loadingPage ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  onClick={e => {
                    e.preventDefault();
                    handlePrevPage();
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={undefined}
                  className={`${!hasNext || loadingPage ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  onClick={e => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
