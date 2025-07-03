"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/homepage-hero-section";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useForumStats } from "@/hooks/use-forum-stats";
import { fetchCommunity } from "@/lib/fetchers/community";
import { fetchThread } from "@/lib/fetchers/thread";
import { fetchFeaturedCommunities, fetchLatestThreads } from "@/lib/supabase";
import type { Community, Thread } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Edit3, Heart, MessageCircle, Sparkles, Users } from "lucide-react";

function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) return "just now";
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Forum-wide stats
  const { data: forumStats, isLoading: loadingStats, isError: statsError } = useForumStats();

  // TanStack Query for latest threads
  const {
    data: threads = [],
    isLoading: loadingThreads,
    error,
  } = useQuery({
    queryKey: ["threads", "latest"],
    queryFn: async (): Promise<Thread[]> => {
      const threadRecords = await fetchLatestThreads(5);
      const transformed: Thread[] = [];
      for (const threadRecord of threadRecords) {
        try {
          const thread = await fetchThread(threadRecord.lens_feed_address);
          if (thread) transformed.push(thread);
        } catch {
          continue;
        }
      }
      return transformed;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // TanStack Query for featured communities
  const { data: featuredCommunities = [] } = useQuery({
    queryKey: ["communities", "featured"],
    queryFn: async (): Promise<Community[]> => {
      const dbCommunities = await fetchFeaturedCommunities();
      const populated = await Promise.all(dbCommunities.map(c => fetchCommunity(c.lens_group_address)));
      return populated.filter(Boolean) as Community[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/40">
      <Navbar />
      <HeroSection />

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Enhanced Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300/60">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 transition-all group-hover:bg-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Members</p>
                <p className="text-lg font-bold text-slate-900">
                  {loadingStats ? (
                    <span className="animate-pulse text-slate-400">...</span>
                  ) : statsError ? (
                    <span className="text-red-500">!</span>
                  ) : (
                    (forumStats?.members?.toLocaleString() ?? 0)
                  )}
                </p>
                {/* Optionally, remove the "+12 today" for now, or keep as mock */}
                {/* <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="h-1 w-1 rounded-full bg-green-500"></div>
                  <span>+12 today</span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-green-300/60">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 transition-all group-hover:bg-green-200">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Active Threads</p>
                <p className="text-lg font-bold text-slate-900">
                  {loadingStats ? (
                    <span className="animate-pulse text-slate-400">...</span>
                  ) : statsError ? (
                    <span className="text-red-500">!</span>
                  ) : (
                    (forumStats?.threads?.toLocaleString() ?? 0)
                  )}
                </p>
                {/* <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="h-1 w-1 rounded-full bg-green-500"></div>
                  <span>+8 today</span>
                </div>  */}
              </div>
            </div>
          </div>
          <div className="group cursor-pointer rounded-2xl border border-slate-300/50 bg-white p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-300/60">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 transition-all group-hover:bg-amber-200">
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Communities</p>
                <p className="text-lg font-bold text-slate-900">
                  {loadingStats ? (
                    <span className="animate-pulse text-slate-400">...</span>
                  ) : statsError ? (
                    <span className="text-red-500">!</span>
                  ) : (
                    (forumStats?.communities?.toLocaleString() ?? 0)
                  )}
                </p>
                {/* <div className="flex items-center gap-1 text-xs text-amber-600">
                  <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                  <span>+1 community</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Featured Thread Card */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900">Latest Conversations</h2>
                      <div className="relative">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                        <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">Join the discussion and share your insights</p>
                  </div>
                  <div className="hidden gap-2 sm:flex">
                    {["All"].map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          activeCategory === category
                            ? "border border-brand-200/50 bg-brand-100 text-brand-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8">
                {loadingThreads ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-5 w-3/4 rounded-lg bg-slate-200"></div>
                            <div className="h-4 w-1/2 rounded-lg bg-slate-200"></div>
                            <div className="h-3 w-1/4 rounded-lg bg-slate-200"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="py-16 text-center">
                    <div className="inline-block rounded-2xl border border-red-200 bg-red-50 p-6">
                      <p className="font-medium text-red-700">{error.message || "Failed to load threads"}</p>
                    </div>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <MessageCircle className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-slate-900">No threads yet</h3>
                    <p className="mb-8 text-slate-500">Be the first to start a meaningful conversation</p>
                    <Button className="rounded-full bg-brand-600 px-8 py-3 text-white hover:bg-brand-700">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Create Thread
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {threads.map(thread => (
                      <div
                        key={thread.id}
                        className="group cursor-pointer rounded-2xl border border-slate-300/60 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300/60"
                      >
                        <div className="flex gap-4">
                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/u/${thread.author.username.replace("lens/", "")}`}
                                className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                              >
                                <div className="relative">
                                  <Avatar className="h-8 w-8 ring-2 ring-white">
                                    <AvatarImage src={thread.author.avatar || undefined} />
                                    <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white">
                                      {thread.author.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  {Math.random() > 0.7 && (
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                                  )}
                                </div>
                                <span className="font-medium">{thread.author.username}</span>
                              </Link>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1 text-sm text-slate-500">
                                <Clock className="h-3 w-3" />
                                {formatDate(new Date(thread.created_at))}
                              </span>
                            </div>

                            <div>
                              <Link href={`/thread/${thread.address}`}>
                                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                                  {thread.title}
                                </h3>
                                {thread.summary && (
                                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{thread.summary}</p>
                                )}
                              </Link>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-brand-600">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{thread.repliesCount || 0} replies</span>
                                </div>
                                <div className="flex cursor-pointer items-center gap-2 transition-colors hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                  <span>{Math.floor(Math.random() * 50) + 1} likes</span>
                                </div>
                              </div>
                              {Math.random() > 0.5 && (
                                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                                  <Sparkles className="h-3 w-3" />
                                  <span>Hot</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8 lg:col-span-4">
            {/* Communities Overview */}
            {/* <div className="overflow-hidden rounded-3xl border border-purple-300/60 bg-white backdrop-blur-sm">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Communities</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Governance", count: 3, color: "bg-blue-500" },
                    { name: "Research", count: 5, color: "bg-green-500" },
                    { name: "Art", count: 12, color: "bg-pink-500" },
                    { name: "Gaming", count: 8, color: "bg-orange-500" },
                  ].map(category => (
                    <div
                      key={category.name}
                      className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-sm transition-all hover:scale-105"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${category.color}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{category.name}</p>
                          <p className="text-xs text-slate-500">{category.count} communities</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-purple-200/40 bg-white/50 px-8 py-4">
                <Link
                  href="/communities"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
                >
                  Explore all communities
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div> */}

            {/* Trending Pulse */}
            {/* <div className="overflow-hidden rounded-3xl border border-amber-300/60 bg-white shadow-xl shadow-amber-200/30 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Trending Now</h3>
                </div>

                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    <TrendingUp className="h-8 w-8 text-amber-600" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-slate-900">Coming Soon</h4>
                  <p className="text-sm text-slate-600">Trending topics will appear here</p>
                </div>
              </div>
              <div className="border-t border-amber-200/40 bg-white/50 px-8 py-4">
                <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Updates coming soon</span>
                </div>
              </div>
            </div> */}

            {/* Featured Communities */}
            <div className="rounded-3xl border border-slate-300/60 bg-white p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Featured Communities</h3>
                <Link
                  href="/communities"
                  className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {featuredCommunities.slice(0, 6).map(community => (
                  <Link key={community.id} href={`/communities/${community.address}`} className="group block">
                    <div className="-m-3 flex items-center gap-4 rounded-2xl p-3 transition-all hover:bg-slate-100/80">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                        {community.logo ? (
                          <Image
                            src={community.logo.replace("lens://", "https://api.grove.storage/")}
                            alt={community.name}
                            width={36}
                            height={36}
                            className="h-12 w-12 rounded-2xl object-cover"
                          />
                        ) : (
                          community.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-brand-600">
                            {community.name}
                          </h4>
                          {/* {community.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                              {community.category}
                            </span>
                          )} */}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs text-slate-500">
                            {community.memberCount.toLocaleString()} members
                          </p>
                        </div>
                        {community.description && (
                          <p className="mt-1 truncate text-xs text-slate-400">{community.description}</p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
