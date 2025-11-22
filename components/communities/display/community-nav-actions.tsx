"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsModerator } from "@/hooks/communities/use-is-moderator";
import { Community } from "@/lib/domain/communities/types";
import { Edit, Plus } from "lucide-react";

export function CommunityNavActions({ community }: { community: Community }) {
  const { isModerator } = useIsModerator(community);

  return (
    <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4">
      {/* Left: Navigation Tabs */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm bg-slate-100 font-medium text-slate-900 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          Latest
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          Top
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          Categories
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {isModerator && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200 dark:hover:bg-yellow-300/40 dark:hover:text-yellow-100"
          >
            <Link href={`/communities/${community.group.address}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Community
            </Link>
          </Button>
        )}

        <Button className="rounded-sm bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          <Plus className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </div>
    </div>
  );
}
