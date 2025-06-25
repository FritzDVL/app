"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { populateCommunities } from "@/lib/populate/communities";
import { useForumStore } from "@/stores/forum-store";
import { CheckCircle, MessageSquare, Search, Users } from "lucide-react";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Use normalized forum store for communities
  const communities = Object.values(useForumStore(state => state.communities));
  const setCommunities = useForumStore(state => state.setCommunities);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const hasPopulated = useRef(false);

  // Fetch and populate communities on mount if not already loaded
  useEffect(() => {
    const doPopulate = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const populated = await populateCommunities();
        setCommunities(populated);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to fetch communities");
      } finally {
        setIsLoading(false);
      }
    };
    if (communities.length > 0 || hasPopulated.current) return;
    hasPopulated.current = true;
    doPopulate();
  }, [communities.length, setCommunities]);

  // Filter communities based on search query
  const filteredCommunities = communities.filter(
    community =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Card */}
            <Card className="mb-8 rounded-xl border border-border bg-card shadow-md">
              <CardContent className="p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center rounded-full border border-brand-300/30 bg-gradient-to-r from-brand-500/20 to-brand-400/20 px-3 py-1">
                      <Users className="mr-2 h-4 w-4 text-brand-600" />
                      <span className="text-sm font-medium text-brand-700">{communities.length} Communities</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Communities</h1>
                    <p className="mt-1 text-slate-600">Discover and join communities in the Lens ecosystem</p>
                  </div>

                  <Link href="/communities/new">
                    <Button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-2 text-base font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
                      Create Community
                    </Button>
                  </Link>
                </div>

                {/* Search Bar */}
                <div className="mt-6">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="rounded-xl border-slate-200/60 bg-white/70 pl-10 backdrop-blur-sm focus:border-brand-400"
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

            {/* Error Messages */}
            {fetchError && (
              <Card className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-red-700">{fetchError}</div>
                </CardContent>
              </Card>
            )}

            {/* Communities Content */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-2xl font-bold text-slate-900">
                    <Users className="mr-3 h-6 w-6 text-brand-500" />
                    All Communities
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {isLoading ? (
                  <LoadingSpinner text="Loading communities..." />
                ) : (
                  <>
                    {/* Search Results Indicator */}
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
                        {filteredCommunities.map(community => (
                          <Link key={community.id} href={`/communities/${community.id}`} className="group">
                            <Card className="rounded-xl border border-border bg-card shadow-md transition-all duration-200 hover:shadow-lg">
                              <CardContent className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                  {community.logo ? (
                                    <Image
                                      src={community.logo.replace("lens://", "https://api.grove.storage/")}
                                      alt={community.name}
                                      width={64}
                                      height={64}
                                      className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-semibold text-white shadow-lg">
                                      {community.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  {community.isVerified && <CheckCircle className="h-5 w-5 text-brand-500" />}
                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                                  {community.name}
                                </h3>

                                <p className="mb-4 line-clamp-2 text-sm text-slate-600">{community.description}</p>

                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-1 text-slate-500">
                                    <Users className="h-4 w-4" />
                                    <span>{community.memberCount.toLocaleString()}</span>
                                  </div>

                                  <Badge
                                    variant="outline"
                                    className="border-brand-200 bg-brand-50 text-xs text-brand-600"
                                  >
                                    {community.category}
                                  </Badge>
                                </div>

                                {community.postCount !== undefined && (
                                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{community.postCount.toLocaleString()} posts</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      /* Empty State */
                      <div className="py-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 shadow-lg">
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
                          <Button className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-2 text-base font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
                            Create Community
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
              <CardHeader className="pb-4">
                <h3 className="font-semibold text-slate-900">Community Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Communities</span>
                  <span className="font-semibold text-slate-900">{communities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Active Members</span>
                  <span className="font-semibold text-slate-900">
                    {communities.reduce((total, c) => total + c.memberCount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Posts</span>
                  <span className="font-semibold text-slate-900">
                    {communities.reduce((total, c) => total + (c.postCount || 0), 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
