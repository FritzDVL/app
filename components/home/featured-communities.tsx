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
    <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-800 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-gray-100">Featured Communities</h3>
          <Link
            href="/communities"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
            <ArrowRight className="h-3 w-3 shrink-0" />
          </Link>
        </div>
      </div>
      <div className="w-full p-4 sm:p-6">
        <div className="w-full space-y-3">
          {featuredCommunities.map(community => (
            <Link
              key={community.id}
              href={`/communities/${community.address}`}
              className="group block w-full cursor-pointer rounded-xl border border-slate-200/60 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-brand-300/60 hover:shadow-sm dark:bg-gray-800"
            >
              <div className="flex w-full min-w-0 items-center gap-3">
                <div className="shrink-0">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                    {community.logo ? (
                      <Image
                        src={groveLensUrlToHttp(community.logo)}
                        alt={community.name}
                        width={32}
                        height={32}
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      community.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h4 className="truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-brand-600 dark:text-gray-100">
                    {community.name}
                  </h4>
                  <p className="truncate text-xs text-slate-500">{community.memberCount.toLocaleString()} members</p>
                  {community.description && (
                    <p className="truncate text-xs text-slate-400" title={community.description}>
                      {community.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 text-slate-900 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 dark:text-gray-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
