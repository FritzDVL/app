import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { StatusBanner } from "@/components/shared/status-banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community } from "@/lib/domain/communities/types";
import { Users } from "lucide-react";

interface ThreadSidebarProps {
  community: Community;
}

export function ThreadSidebar({ community }: ThreadSidebarProps) {
  const rawDescription = community.group.metadata?.description || "";
  const description = rawDescription
    ? rawDescription.length > 140
      ? rawDescription.slice(0, 140) + "…"
      : rawDescription
    : "No description available.";

  return (
    <Link
      href={`/communities/${community.group.address}`}
      aria-label={`View community ${community.name}`}
      className="group block focus:outline-none focus-visible:outline-none"
    >
      <Card className="motion-preset-fade-in cursor-pointer rounded-3xl bg-white backdrop-blur-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-gray-700/60 dark:bg-gray-800">
        <CardHeader>
          <h3 className="text-lg font-semibold">Community</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={community.group.metadata?.coverPicture || undefined} alt={community.name} />
              <AvatarFallback className="bg-gradient-to-br from-brand-500 to-brand-600 text-base font-semibold text-white">
                {community.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-medium text-foreground transition-colors group-hover:text-brand-600">
                {community.name}
              </h2>
            </div>
          </div>
          <p className="text-sm leading-snug text-muted-foreground">{description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community.memberCount.toLocaleString()} members</span>
            </div>
          </div>
          {community.memberCount === 0 && <StatusBanner type="info" title="No members yet" />}
        </CardContent>
      </Card>
    </Link>
  );
}
