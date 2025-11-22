"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Profile } from "@lens-protocol/react-web";
import { CalendarDays, Users } from "lucide-react";

interface UserHoverCardProps {
  profile: Profile | any; // Using any for now as Profile type might vary based on SDK version
  children: React.ReactNode;
}

export function UserHoverCard({ profile, children }: UserHoverCardProps) {
  if (!profile) return <>{children}</>;

  const joinedDate = profile.createdAt ? new Date(profile.createdAt) : null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={profile.metadata?.picture?.optimized?.uri || profile.metadata?.picture} />
            <AvatarFallback>{profile.handle?.localName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@{profile.handle?.localName || profile.handle?.fullHandle}</h4>
            <p className="text-sm text-muted-foreground">{profile.metadata?.bio || "No bio available."}</p>
            <div className="flex items-center pt-2">
              <Users className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">{profile.stats?.followers || 0} followers</span>
            </div>
            {joinedDate && (
              <div className="flex items-center pt-1">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">Joined {joinedDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
