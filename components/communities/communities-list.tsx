import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { groveLensUrlToHttp } from "@/lib/utils";
import { MessageSquare, Search, Users } from "lucide-react";

interface Community {
  id: string;
  address: string;
  name: string;
  description: string;
  logo?: string;
  memberCount: number;
  postCount?: number;
}

interface CommunitiesListProps {
  communities: Community[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  searchQuery: string;
}

export function CommunitiesList({ communities, isLoading, isError, error, searchQuery }: CommunitiesListProps) {
  return (
    <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
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
                  Found {communities.length} communit
                  {communities.length === 1 ? "y" : "ies"}
                  {searchQuery && ` for "${searchQuery}"`}
                </span>
              </div>
            )}
            {communities.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {communities.map(community => (
                  <Link key={community.id} href={`/communities/${community.address}`} className="group">
                    <Card className="rounded-2xl border border-slate-300/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/60">
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
                        <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                          {community.name}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-slate-600">{community.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Users className="h-4 w-4" />
                            <span>{community.memberCount.toLocaleString()}</span>
                          </div>
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
