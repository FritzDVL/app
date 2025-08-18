"use client";

import { useState } from "react";
import { LatestThreads } from "./latest-threads";
import type { Thread } from "@/lib/domain/threads/types";

interface ThreadsSwitcherProps {
  featuredThreads: Thread[];
  latestThreads: Thread[];
}

export function ThreadsSwitcher({ featuredThreads, latestThreads }: ThreadsSwitcherProps) {
  const [activeCategory, setActiveCategory] = useState("Featured");

  const showThreads = activeCategory === "Featured" ? featuredThreads : latestThreads;

  return (
    <LatestThreads
      threads={showThreads}
      loadingThreads={false}
      error={null}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
    />
  );
}
