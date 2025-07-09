import Image from "next/image";
import Link from "next/link";
import { groveLensUrlToHttp } from "@/lib/utils";
import { Community } from "@/types/common";
import { ArrowRight } from "lucide-react";

interface FeaturedCommunitiesProps {
  featuredCommunities: Community[];
}

export function FeaturedCommunities({ featuredCommunities }: FeaturedCommunitiesProps) {
  return (
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
                    src={groveLensUrlToHttp(community.logo)}
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
                </div>
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs text-slate-500">{community.memberCount.toLocaleString()} members</p>
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
  );
}
