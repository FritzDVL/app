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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { VotingActions } from "@/components/voting-actions";
import { useCommunitiesFeatured } from "@/hooks/use-communities-featured";
import { useThreadsLatest } from "@/hooks/use-threads-latest";
import { postId } from "@lens-protocol/react";
import { Building2, Edit3, MessageCircle, Sparkles, TrendingUp, Trophy, Zap } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("new");
  const { threads, loading, error } = useThreadsLatest();
  const { featured: featuredCommunities, isLoading: loadingFeatured } = useCommunitiesFeatured();

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section - Minimalistic */}
        <HeroSection />

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Latest Threads */}
            <Card className="border border-border bg-white shadow-md">
              <CardHeader className="border-b border-border bg-muted/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold text-foreground">
                    <Zap className="mr-2 h-5 w-5 text-brand-500" />
                    Latest Threads
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Simplified Tab Navigation */}
                  <div className="mb-6 flex w-full rounded-lg border bg-muted/80 p-1.5">
                    <button
                      onClick={() => setActiveTab("new")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                        activeTab === "new"
                          ? "border bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      New
                    </button>
                    <button
                      onClick={() => setActiveTab("top")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                        activeTab === "top"
                          ? "border bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Trophy className="h-4 w-4" />
                      Top
                    </button>
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
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <MessageCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">No threads yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Be the first to start a thread in this community.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {threads.map(thread => (
                          <Card
                            key={thread.id}
                            className="group cursor-pointer border-2 border-border bg-white transition-all duration-200 hover:border-brand-300 hover:shadow-md"
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                {thread.rootPost && (
                                  <div className="flex flex-col items-center gap-1">
                                    <VotingActions
                                      postid={postId(thread.rootPost.id)}
                                      score={thread.rootPost.stats.upvotes - thread.rootPost.stats.downvotes}
                                    />
                                  </div>
                                )}

                                <div className="min-w-0 flex-1 space-y-3">
                                  {/* Author Info */}
                                  <div className="flex items-center justify-between">
                                    <Link
                                      href={`/u/${thread.author.username.replace("lens/", "")}`}
                                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <Avatar className="h-5 w-5">
                                        <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">{thread.author.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium">{thread.author.name}</span>
                                    </Link>
                                    <span className="text-xs text-muted-foreground">
                                      {thread.timeAgo || new Date(thread.created_at).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {/* Thread Content */}
                                  <div>
                                    <Link href={`/thread/${thread.id}`}>
                                      <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-brand-600">
                                        {thread.title}
                                      </h3>
                                    </Link>
                                    {thread.summary && (
                                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                        {thread.summary}
                                      </p>
                                    )}
                                  </div>

                                  {/* Tags and Stats */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {Array.isArray(thread.tags) &&
                                        thread.tags.slice(0, 3).map(tag => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <MessageCircle className="h-3 w-3" />
                                        {thread.repliesCount}
                                      </div>
                                    </div>
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
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">Top threads coming soon</h3>
                      <p className="text-sm text-muted-foreground">
                        We&apos;re working on bringing you the most popular threads.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border border-border bg-white shadow-md">
              <CardHeader className="border-b border-border bg-muted/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button className="w-full justify-start" size="sm">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Create Thread
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Building2 className="mr-2 h-4 w-4" />
                    Browse Communities
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Communities */}
            <Card className="border border-border bg-white shadow-md">
              <CardHeader className="border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Featured Communities</h3>
                  <Link href="/communities">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      View all
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {loadingFeatured ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner text="Loading..." />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {featuredCommunities.slice(0, 5).map(forum => (
                      <Link key={forum.id} href={`/communities/${forum.address}`}>
                        <div className="group flex cursor-pointer items-center gap-3 rounded-md border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/30">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-sm font-semibold text-white">
                            {forum.logo ? (
                              <Image
                                src={forum.logo.replace("lens://", "https://api.grove.storage/")}
                                alt={forum.name}
                                className="h-8 w-8 rounded-md object-cover"
                                width={32}
                                height={32}
                              />
                            ) : (
                              forum.name?.charAt(0)?.toUpperCase() || "?"
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-brand-600">
                              {forum.name}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="border border-border bg-white shadow-md">
              <CardHeader className="border-b border-border bg-muted/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Community Stats</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-semibold text-foreground">43.7K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Threads</span>
                    <span className="font-semibold text-foreground">1.2K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Online</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                      <span className="font-semibold text-foreground">892</span>
                    </div>
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
