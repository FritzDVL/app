"use client";

import Link from "next/link";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { useIsModerator } from "@/hooks/communities/use-is-moderator";
import { Community } from "@/lib/domain/communities/types";
import { Edit } from "lucide-react";

export function CommunityNavActions({ community }: { community: Community }) {
  const isModerator = useIsModerator(community);
  return (
    <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4">
      <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
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
    </div>
  );
}
