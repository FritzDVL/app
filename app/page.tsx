"use client";

import { useState } from "react";
import { FeaturedCommunities } from "@/components/home/featured-communities";
import { HeroSection } from "@/components/home/hero-section";
import { LatestThreads } from "@/components/home/latest-threads";
import { StatsBar } from "@/components/home/stats-bar";
import { useForumStats } from "@/hooks/common/use-forum-stats";
import { useFeaturedCommunities } from "@/hooks/queries/use-featured-communities";
import { useLatestThreads } from "@/hooks/queries/use-latest-threads";
import { getTimeAgo } from "@/lib/utils";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Forum-wide stats
  const { data: forumStats, isLoading: loadingStats, isError: statsError } = useForumStats();

  // Latest threads (optimized custom hook)
  const { data: threads = [], isLoading: loadingThreads, error } = useLatestThreads(5);

  // Featured communities (custom hook)
  const { data: featuredCommunities = [] } = useFeaturedCommunities();

  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StatsBar loadingStats={loadingStats} statsError={statsError} forumStats={forumStats ?? undefined} />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <LatestThreads
              threads={threads}
              loadingThreads={loadingThreads}
              error={error}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              formatDate={getTimeAgo}
            />
          </div>
          <div className="space-y-8 lg:col-span-4">
            <FeaturedCommunities featuredCommunities={featuredCommunities} />
          </div>
        </div>
      </div>
    </>
  );
}
