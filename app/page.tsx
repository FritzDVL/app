"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/homepage-hero-section";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { VotingActions } from "@/components/voting-actions";
import { useCommunitiesFeatured } from "@/hooks/use-communities-featured";
import { useThreadsLatest } from "@/hooks/use-threads-latest";
import { postId } from "@lens-protocol/react";
import { MessageCircle, TrendingUp, Zap } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("new");
  const { threads, loading, error } = useThreadsLatest();
  const { featured: featuredCommunities, isLoading: loadingFeatured } = useCommunitiesFeatured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100/30">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section - Minimalistic */}
        <HeroSection />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Trending Discussions */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-2xl font-bold text-slate-900">
                    <Zap className="mr-3 h-6 w-6 text-orange-500" />
                    Trending
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Custom Fancy Tab Navigation */}
                  <div className="relative mb-8 w-full">
                    <div className="relative flex w-full items-center rounded-2xl bg-gradient-to-r from-slate-100/80 via-white/90 to-slate-100/80 p-1.5 shadow-inner backdrop-blur-sm">
                      {/* Animated Background Indicator */}
                      <div
                        className={`absolute h-9 rounded-xl bg-gradient-to-r from-brand-400 to-brand-600 shadow-lg transition-all duration-300 ease-out ${
                          activeTab === "new"
                            ? "left-1.5 w-[calc(50%-4px)]"
                            : activeTab === "top"
                              ? "left-[50%] w-[calc(50%-4px)]"
                              : "left-[50%] w-[calc(50%-4px)]"
                        }`}
                      />

                      {/* Tab Buttons */}
                      <button
                        onClick={() => setActiveTab("new")}
                        className={`relative z-10 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ${
                          activeTab === "new" ? "text-white shadow-sm" : "text-black hover:text-brand-600"
                        }`}
                      >
                        <span className="text-base">✨</span>
                        <span className="text-sm">New</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("top")}
                        className={`relative z-10 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 ${
                          activeTab === "top" ? "text-white shadow-sm" : "text-black hover:text-brand-600"
                        }`}
                      >
                        <span className="text-base">🏆</span>
                        <span className="text-sm">Top</span>
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -left-2 -top-1 h-6 w-6 rounded-full bg-gradient-to-br from-brand-400/20 to-brand-600/20 blur-sm" />
                    <div className="absolute -bottom-1 -right-2 h-4 w-4 rounded-full bg-gradient-to-br from-brand-300/20 to-brand-700/20 blur-sm" />
                  </div>

                  <TabsContent value="new" className="mt-0">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <LoadingSpinner text="Loading latest threads..." />
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-12">
                        <span className="text-red-500">{error}</span>
                      </div>
                    ) : threads.length === 0 ? (
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100/80 to-brand-200/60 p-12 text-center backdrop-blur-sm">
                        <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-brand-200/30 blur-xl" />
                        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-brand-300/30 blur-xl" />
                        <div className="relative z-10">
                          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
                            <MessageCircle className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="mb-3 text-xl font-semibold text-brand-900">Fresh Discussions</h3>
                          <p className="mx-auto max-w-md text-brand-800">
                            New conversations are brewing. Check back soon for the latest discussions and hot takes from
                            the community.
                          </p>
                          <div className="mt-6 flex justify-center gap-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-brand-500"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-brand-700"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {threads.map(thread => (
                          <Card
                            key={thread.id}
                            className="gradient-card group min-h-[64px] cursor-pointer rounded-xl border border-border bg-white shadow-md transition-all duration-200 hover:shadow-lg"
                          >
                            <CardContent className="p-3 sm:p-4 md:p-5">
                              <div className="flex items-start">
                                {thread.rootPost && (
                                  <VotingActions
                                    postid={postId(thread.rootPost.id)}
                                    score={thread.rootPost.stats.upvotes - thread.rootPost.stats.downvotes}
                                  />
                                )}
                                {/* Content Section (no logo, no score) */}
                                <div className="ml-4 min-w-0 flex-1">
                                  <div className="mb-1 flex items-start justify-between">
                                    <div className="flex items-center space-x-1.5">
                                      {/* {thread.isPinned && (
                                        <Badge className="h-5 border-yellow-200 bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">
                                          📌 Pinned
                                        </Badge>
                                      )}
                                      {thread.tags.length > 0 &&
                                        thread.tags.map(tag => (
                                          <Badge key={tag} variant="outline" className="h-5 px-1.5 py-0.5 text-xs">
                                            {tag}
                                          </Badge>
                                        ))} */}
                                    </div>
                                    {/* Author Data Top Right */}
                                    <Link
                                      href={`/u/${thread.author.username.replace("lens/", "")}`}
                                      className="flex items-center space-x-1.5 hover:text-green-600"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">{thread.author.name}</span>
                                    </Link>
                                  </div>
                                  <Link href={`/thread/${thread.id}`}>
                                    <h3 className="mb-1 line-clamp-2 cursor-pointer text-lg font-semibold transition-colors group-hover:text-brand-600">
                                      {thread.title}
                                    </h3>
                                  </Link>
                                  {thread.summary && (
                                    <p className="mb-2 line-clamp-2 text-sm text-black">{thread.summary}</p>
                                  )}
                                  <div className="mb-2 flex flex-wrap gap-1.5">
                                    {Array.isArray(thread.tags) &&
                                      thread.tags.map(tag => (
                                        <Badge
                                          key={tag}
                                          variant="outline"
                                          className="h-5 cursor-pointer px-1.5 py-0.5 text-xs hover:bg-green-50"
                                        >
                                          #{tag}
                                        </Badge>
                                      ))}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <MessageCircle className="mr-1 h-3.5 w-3.5" />
                                      {thread.repliesCount}
                                    </div>
                                    <span className="text-[11px] text-gray-500">
                                      {thread.timeAgo || new Date(thread.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="top" className="mt-0">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100/80 to-emerald-200/60 p-12 text-center backdrop-blur-sm">
                      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-200/30 blur-xl" />
                      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-emerald-300/30 blur-xl" />
                      <div className="relative z-10">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
                          <TrendingUp className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-brand-900">All-Time Legends</h3>
                        <p className="mx-auto max-w-md text-brand-800">
                          Discover the most epic discussions that have shaped our community. The cream of the crop
                          awaits.
                        </p>
                        <div className="mt-6 flex justify-center">
                          <div className="flex items-center gap-1">
                            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-brand-600 to-brand-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Communities */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Featured Communities</h3>
                  <Link href="/communities">
                    <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700">
                      View all
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {loadingFeatured ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner text="Loading featured..." />
                  </div>
                ) : (
                  featuredCommunities.map(forum => (
                    <Link key={forum.id} href={`/communities/${forum.address}`}>
                      <div className="group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg text-white">
                          {forum.logo ? (
                            <Image
                              src={forum.logo.replace("lens://", "https://api.grove.storage/")}
                              alt={forum.name}
                              className="h-14 w-14 object-contain"
                              width={32}
                              height={32}
                            />
                          ) : (
                            forum.name?.charAt(0)?.toUpperCase() || "?"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-medium text-slate-900 transition-colors group-hover:text-brand-600">
                            {forum.name}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader className="pb-4">
                <h3 className="font-semibold text-slate-900">Community Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Members</span>
                  <span className="font-semibold text-slate-900">43.7K</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Active Discussions</span>
                  <span className="font-semibold text-slate-900">1.2K</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Online Now</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                    <span className="font-semibold text-slate-900">892</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
