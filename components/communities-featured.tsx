"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  emoji: string;
  memberCount: number;
  threadCount: number;
  isPrivate: boolean;
  isPremium: boolean;
  trending: boolean;
  category: string;
  createdAt: string;
  lastActivity: string;
}

interface CommunitiesFeaturedProps {
  communities: Community[];
  maxItems?: number;
}

export function CommunitiesFeatured({ communities, maxItems = 3 }: CommunitiesFeaturedProps) {
  const featuredCommunities = communities
    .filter(community => community.trending || community.isPremium)
    .slice(0, maxItems);

  if (featuredCommunities.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="motion-preset-slide-right flex items-center text-2xl font-bold">
          <Star className="motion-preset-bounce motion-delay-100 mr-2 h-6 w-6 text-yellow-500" />
          Featured Communities
        </h2>
        <Link href="/communities">
          <Button variant="ghost" className="hover:motion-preset-wobble text-purple-600 hover:text-purple-700">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredCommunities.map((community, index) => (
          <div
            key={community.id}
            className="motion-preset-slide-up"
            style={{
              animationDelay: `${200 + index * 150}ms`,
            }}
          >
            {/* <CommunitiesCard community={community} /> */}
          </div>
        ))}
      </div>
    </div>
  );
}
