"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommunityRuleMessage } from "@/components/communities/rules/community-rule-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { GroupRuleType } from "@lens-protocol/client";
import { MessageSquare, Search, Users } from "lucide-react";

interface CommunitiesListProps {
  initialCommunities: Community[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function CommunitiesList({ initialCommunities, isLoading, isError, error }: CommunitiesListProps) {
  // Client state for search
  const [searchQuery, setSearchQuery] = useState("");
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
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <LoadingSpinner text="Loading communities..." />
        ) : isError ? (
          <Card className="mb-6 rounded-2xl border-red-300/60 bg-white backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-red-700">
                {error instanceof Error ? error.message : "Failed to fetch communities"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                <Search className="h-4 w-4" />
                <span>
                  Found {filteredCommunities.length} communit
                  {filteredCommunities.length === 1 ? "y" : "ies"}
                  {searchQuery && ` for "${searchQuery}"`}
                </span>
              </div>
            )}
            {filteredCommunities.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {filteredCommunities.map(community => {
                  // --- Extract rule type from Lens GroupRules structure ---
                  const ruleType = community.group.rules?.required?.[0]?.type;
                  return (
                    <Link key={community.id} href={`/communities/${community.group.address}`} className="group">
                      <Card className="group w-full min-w-0 cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800 sm:p-6">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            {community.group.metadata?.icon ? (
                              <Image
                                src={groveLensUrlToHttp(community.group.metadata.icon)}
                                alt={community.name}
                                width={64}
                                height={64}
                                className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-semibold text-white">
                                {community.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h3 className="mb-2 flex items-center text-lg font-semibold text-foreground transition-colors group-hover:text-brand-600">
                            {community.name}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                            {community.group.metadata?.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{community.memberCount.toLocaleString()}</span>
                              {ruleType && ruleType !== "none" && (
                                <CommunityRuleMessage ruleType={ruleType as GroupRuleType} />
                              )}
                            </div>
                          </div>
                          {community.postCount !== undefined && (
                            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              <span>{community.postCount.toLocaleString()} posts</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200">
                  <Users className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {searchQuery ? "No communities found" : "No communities yet"}
                </h3>
                <p className="mx-auto mb-8 max-w-md text-slate-600">
                  {searchQuery
                    ? "Try adjusting your search or create a new community to get started."
                    : "Be the first to create a community and start building an amazing ecosystem!"}
                </p>
                <Link href="/communities/new">
                  <Button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-brand-600 hover:to-brand-700">
                    Create Community
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
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
