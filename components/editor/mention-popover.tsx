"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProfileAccount } from "@/hooks/account/use-profile-account";
import { Calendar, Users } from "lucide-react";

interface MentionPopoverProps {
  username: string;
  children: React.ReactNode;
}

function MentionPopoverContent({ username }: { username: string }) {
  const { lensAccount: profile, stats, isLoading } = useProfileAccount(username);
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500"></div>
        </div>
      ) : profile ? (
        <div className="p-4">
          {/* Header with avatar and basic info */}
          <div className="mb-4 flex items-start gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-brand-200 dark:ring-brand-700">
              <AvatarImage src={profile.metadata?.picture} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                {profile.metadata?.name?.charAt(0).toUpperCase() || username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {profile.metadata?.name || `@${username}`}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{username}</p>
            </div>
          </div>

          {/* Bio */}
          {profile.metadata?.bio && (
            <p className="mb-4 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
              {profile.metadata.bio.length > 150 ? `${profile.metadata.bio.slice(0, 150)}...` : profile.metadata.bio}
            </p>
          )}

          {/* Stats */}
          <div className="mb-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{stats.followers}</span>
              <span>followers</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">{stats.following}</span>
              <span>following</span>
            </div>
          </div>

          {/* Joined Date */}
          <div className="mb-4 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">Profile not found</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function MentionPopover({ username, children }: MentionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="cursor-pointer">
          {children}
        </span>
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent
          className="w-80 overflow-hidden rounded-xl border border-gray-200/60 bg-white/95 p-0 shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/95"
          side="top"
          align="start"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <MentionPopoverContent username={username} />
        </PopoverContent>
      )}
    </Popover>
  );
}
