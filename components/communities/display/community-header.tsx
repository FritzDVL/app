import Image from "next/image";
import Link from "next/link";
import { HamburgerMenu } from "@/components/layout/hamburger-menu";
import { Button } from "@/components/ui/button";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { Search } from "lucide-react";

export function CommunityHeader({ community }: { community: Community }) {
  if (!community) return null;

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Left: Hamburger + Logo + Title */}
        <div className="flex items-center gap-3">
          <HamburgerMenu />

          <Link href="/" className="flex items-center gap-3">
            {community.group.metadata?.icon ? (
              <Image
                src={groveLensUrlToHttp(community.group.metadata?.icon)}
                alt={community.name}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-600">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{community.name}</h1>
          </Link>
        </div>

        {/* Right: Search + User */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
