"use client";

import { useState } from "react";
import { FeaturedCommunities } from "@/components/home/featured-communities";
import { HeroSection } from "@/components/home/hero-section";
import { LatestThreads } from "@/components/home/latest-threads";
import { StatsBar } from "@/components/home/stats-bar";
import { useForumStats } from "@/hooks/common/use-forum-stats";
import { useFeaturedCommunities } from "@/hooks/queries/use-featured-communities";
import { useFeaturedThreads } from "@/hooks/queries/use-featured-threads";
import { useLatestThreads } from "@/hooks/queries/use-latest-threads";
import { getTimeAgo } from "@/lib/utils";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Featured");

  // Forum-wide stats
  const { data: forumStats, isLoading: loadingStats, isError: statsError } = useForumStats();

  // Latest threads (optimized custom hook)
  const { data: threads = [], isLoading: loadingThreads, error } = useLatestThreads(5);
  const { data: featuredThreads = [], isLoading: loadingFeaturedThreads } = useFeaturedThreads(5);

  // Featured communities (custom hook)
  const { data: featuredCommunities = [] } = useFeaturedCommunities();

  // Thread list to show depending on category
  const showThreads = activeCategory === "Featured" ? featuredThreads : threads;
  const showLoading = activeCategory === "Featured" ? loadingFeaturedThreads : loadingThreads;

  return (
    <>
      <HeroSection />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StatsBar loadingStats={loadingStats} statsError={statsError} forumStats={forumStats ?? undefined} />
        <div className="w-full">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full gap-8 lg:w-2/3 lg:pr-4">
              <LatestThreads
                threads={showThreads}
                loadingThreads={showLoading}
                error={error}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                formatDate={getTimeAgo}
              />
            </div>
            <div className="w-full gap-8 lg:w-1/3 lg:pl-4">
              <FeaturedCommunities featuredCommunities={featuredCommunities} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
