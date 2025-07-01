"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/homepage-hero-section";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Edit3, Heart, MessageCircle, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

// Sample data structure
interface ThreadWithAuthor {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  messageCount?: number;
  author: {
    username: string;
    profileImage?: string;
  };
}

interface Community {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
  image?: string;
  description?: string;
  isVerified?: boolean;
  activityLevel?: "high" | "medium" | "low";
  category?: string;
}

// Mock data
const sampleCommunities: Community[] = [
  {
    id: "1",
    name: "Lens Governance",
    slug: "governance",
    memberCount: 2567,
    description: "Shape the future of Lens Protocol",
    isVerified: true,
    activityLevel: "high",
    category: "Governance",
  },
  {
    id: "2",
    name: "DeFi Research",
    slug: "defi",
    memberCount: 1834,
    description: "Deep dive into DeFi protocols",
    isVerified: true,
    activityLevel: "high",
    category: "Research",
  },
  {
    id: "3",
    name: "NFT Creators",
    slug: "nft",
    memberCount: 3421,
    description: "Showcase and discuss NFT art",
    isVerified: false,
    activityLevel: "medium",
    category: "Art",
  },
  {
    id: "4",
    name: "Tech Innovation",
    slug: "tech",
    memberCount: 1234,
    description: "Latest in blockchain technology",
    isVerified: true,
    activityLevel: "medium",
    category: "Technology",
  },
  {
    id: "5",
    name: "Web3 Gaming",
    slug: "gaming",
    memberCount: 4567,
    description: "The future of gaming on blockchain",
    isVerified: false,
    activityLevel: "high",
    category: "Gaming",
  },
  {
    id: "6",
    name: "Social Impact",
    slug: "impact",
    memberCount: 892,
    description: "Using Web3 for positive change",
    isVerified: true,
    activityLevel: "low",
    category: "Social",
  },
];

function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) return "just now";
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
}

export default function HomePage() {
  const [threads, setThreads] = useState<ThreadWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [communities] = useState(sampleCommunities);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/threads");
        if (!response.ok) {
          throw new Error("Failed to fetch threads");
        }
        const data = await response.json();
        setThreads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar />
      <HeroSection />

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Enhanced Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 transition-all group-hover:bg-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Members</p>
                <p className="text-lg font-bold text-slate-900">1,337</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="h-1 w-1 rounded-full bg-green-500"></div>
                  <span>+12 today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-100/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 transition-all group-hover:bg-green-200">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Active Threads</p>
                <p className="text-lg font-bold text-slate-900">284</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="h-1 w-1 rounded-full bg-green-500"></div>
                  <span>+8 today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-100/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2 transition-all group-hover:bg-purple-200">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Active Now</p>
                <p className="text-lg font-bold text-slate-900">42</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></div>
                  <span className="text-xs text-slate-500">Live</span>
                </div>
              </div>
            </div>
          </div>
          <div className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-100/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-100 p-2 transition-all group-hover:bg-amber-200">
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">This Week</p>
                <p className="text-lg font-bold text-slate-900">1.2k</p>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <div className="h-1 w-1 rounded-full bg-amber-500"></div>
                  <span>+156 posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Featured Thread Card */}
            <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/20 backdrop-blur-sm">
              <div className="border-b border-slate-100/80 bg-gradient-to-r from-slate-50/80 to-white/90 px-8 py-6">
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
                    {["All", "Governance", "Research", "Community"].map(category => (
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
                {isLoading ? (
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
                      <p className="font-medium text-red-700">{error}</p>
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
                        className="group cursor-pointer rounded-2xl border border-slate-200/60 p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300/60 hover:shadow-lg hover:shadow-brand-100/50"
                      >
                        <div className="flex gap-4">
                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/user/${thread.author.username}`}
                                className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-slate-900"
                              >
                                <div className="relative">
                                  <Avatar className="h-8 w-8 shadow-sm ring-2 ring-white">
                                    <AvatarImage src={thread.author.profileImage || undefined} />
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
                                {formatDate(new Date(thread.createdAt))}
                              </span>
                            </div>

                            <div>
                              <Link href={`/thread/${thread.id}`}>
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
                                  <span>{thread.messageCount || 0} replies</span>
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
            <div className="rounded-3xl border border-purple-200/60 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 p-8 backdrop-blur-sm">
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
                    className="rounded-2xl border border-white/60 bg-white/50 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-md"
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

            {/* Trending Pulse */}
            <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-8 backdrop-blur-sm">
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

            {/* Quick Actions */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Quick Actions</h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="group w-full justify-start rounded-full border-brand-200/60 bg-gradient-to-r from-brand-50 to-white py-3 transition-all hover:from-brand-100 hover:to-brand-50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-500 p-1">
                      <Edit3 className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">Start New Thread</span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
                <Button
                  variant="outline"
                  className="group w-full justify-start rounded-full border-slate-200/60 bg-white/50 py-3 transition-all hover:bg-slate-50/80 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-1">
                      <Users className="h-3 w-3 text-purple-600" />
                    </div>
                    <span className="font-medium">Explore Communities</span>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </div>
            </div>

            {/* Featured Communities */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm">
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
                {communities.slice(0, 6).map(community => (
                  <Link key={community.id} href={`/community/${community.slug}`} className="group block">
                    <div className="-m-3 flex items-center gap-4 rounded-2xl p-3 transition-all hover:bg-slate-50/80 hover:shadow-sm">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white shadow-md">
                        {community.image ? (
                          <img
                            src={community.image}
                            alt={community.name}
                            className="h-12 w-12 rounded-2xl object-cover"
                          />
                        ) : (
                          community.name.charAt(0)
                        )}
                        {community.isVerified && (
                          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 ring-2 ring-white">
                            <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        {community.activityLevel === "high" && !community.isVerified && (
                          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                            <Sparkles className="h-2 w-2 text-amber-900" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-brand-600">
                            {community.name}
                          </h4>
                          {community.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                              {community.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs text-slate-500">
                            {community.memberCount.toLocaleString()} members
                          </p>
                          {community.activityLevel === "high" && (
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></div>
                              <span className="text-xs text-green-600">Active</span>
                            </div>
                          )}
                          {community.activityLevel === "medium" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                          )}
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

            {/* Recent Activity */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    user: "alice.lens",
                    action: "created a thread in",
                    target: "DeFi Research",
                    time: "2m ago",
                    avatar: "A",
                  },
                  {
                    user: "bob.lens",
                    action: "replied to",
                    target: "Governance Proposal #12",
                    time: "5m ago",
                    avatar: "B",
                  },
                  {
                    user: "carol.lens",
                    action: "joined",
                    target: "NFT Creators",
                    time: "12m ago",
                    avatar: "C",
                  },
                ].map(activity => (
                  <div key={`${activity.user}-${activity.time}`} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-medium text-white shadow-sm">
                      {activity.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium text-slate-900">{activity.user}</span>{" "}
                        <span className="text-slate-600">{activity.action}</span>{" "}
                        <span className="cursor-pointer font-medium text-brand-600 hover:text-brand-700">
                          {activity.target}
                        </span>
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Pulse */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Community Pulse</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-600">Active now</span>
                  </div>
                  <span className="text-lg font-semibold text-slate-900">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total members</span>
                  <span className="text-lg font-semibold text-slate-900">1,337</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active threads</span>
                  <span className="text-lg font-semibold text-slate-900">28</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
