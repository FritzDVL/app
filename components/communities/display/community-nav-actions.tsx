"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsModerator } from "@/hooks/communities/use-is-moderator";
import { Community } from "@/lib/domain/communities/types";
import { CATEGORIES } from "@/lib/shared/categories";
import { Edit, Plus } from "lucide-react";
import { ChevronDown } from "lucide-react";

export function CommunityNavActions({ community }: { community: Community }) {
  const { isModerator } = useIsModerator(community);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
      {/* Left: Navigation Tabs */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/")}
          className={`border-b-2 px-1 py-2 text-[15px] font-medium transition-colors ${!currentCategory ? "border-brand-500 text-slate-900 dark:text-white" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
        >
          Latest
        </button>
        <button className="border-b-2 border-transparent px-1 py-2 text-[15px] font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300">
          Top
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-3">
          <SearchInput />
          {/* Categories Dropdown (Placeholder for now, could be a real dropdown later) */}
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {currentCategory
                  ? CATEGORIES.find(c => c.hashtag === currentCategory)?.label || "Categories"
                  : "Categories"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/")}>All Categories</DropdownMenuItem>
              {CATEGORIES.map(category => (
                <DropdownMenuItem key={category.id} onClick={() => router.push(`/?category=${category.hashtag}`)}>
                  <span className={`mr-2 h-2 w-2 rounded-full ${category.color}`} />
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Topic Button */}
          <Link href="/thread/create">
            <Button className="rounded-sm bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
