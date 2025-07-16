"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Moderator } from "@/types/common";

interface CommunityModeratorsProps {
  moderators: Moderator[];
}

export function CommunityModerators({ moderators }: CommunityModeratorsProps) {
  return (
    <Card className="motion-preset-fade-in rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader>
        <h3 className="text-lg font-semibold">Moderators</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {moderators.length > 0 ? (
          moderators
            .filter(mod => mod.username)
            .map(mod => (
              <Link
                key={mod.address}
                href={`/u/${mod.username.replace("lens/", "")}`}
                className="flex items-center space-x-3 transition-colors hover:text-brand-600"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mod.picture || "/placeholder.svg?height=32&width=32"} alt={mod.displayName} />
                  <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
                    {mod.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{mod.displayName}</span>
                  <span className="text-xs text-gray-500">@{mod.username}</span>
                </div>
              </Link>
            ))
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">No moderators assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
