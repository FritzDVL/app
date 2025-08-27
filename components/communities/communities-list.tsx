"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredCommunities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return initialCommunities;
    const query = debouncedSearchQuery.toLowerCase().trim();
    return initialCommunities.filter(
      (community: Community) =>
        community.name.toLowerCase().includes(query) ||
        (community.description && community.description.toLowerCase().includes(query)),
    );
  }, [initialCommunities, debouncedSearchQuery]);

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
                  // Detect rule type for badge/icon
                  let ruleIcon = null;
                  let ruleText = null;
                  // --- Extract rule type from Lens GroupRules structure ---
                  let ruleType: string | undefined = undefined;
                  if (
                    community.rules &&
                    Array.isArray(community.rules.required) &&
                    community.rules.required.length > 0
                  ) {
                    ruleType = community.rules.required[0]?.type;
                  }
                  if (ruleType && ruleType !== "none") {
                    switch (ruleType) {
                      case "SimplePaymentGroupRule":
                        ruleIcon = (
                          <svg
                            className="mr-1 h-4 w-4 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" />
                          </svg>
                        );
                        ruleText = "Payment required";
                        break;
                      case "TokenGatedGroupRule":
                        ruleIcon = (
                          <svg
                            className="mr-1 h-4 w-4 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8M12 8v8" />
                          </svg>
                        );
                        ruleText = "Token required";
                        break;
                      case "MembershipApprovalGroupRule":
                        ruleIcon = (
                          <svg
                            className="mr-1 h-4 w-4 text-rose-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        );
                        ruleText = "Approval required";
                        break;
                    }
                  }
                  return (
                    <Link key={community.id} href={`/communities/${community.address}`} className="group">
                      <Card className="group w-full min-w-0 cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800 sm:p-6">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            {community.logo ? (
                              <Image
                                src={groveLensUrlToHttp(community.logo) || ""}
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
                            {ruleIcon && (
                              <span className="ml-2 flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200">
                                {ruleIcon}
                                {ruleText}
                              </span>
                            )}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{community.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{community.memberCount.toLocaleString()}</span>
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
      </CardContent>
    </Card>
  );
}
