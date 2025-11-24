import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getStampUrl } from "@/lib/utils/get-stamp-url";
import { Account } from "@lens-protocol/client";
import { Calendar, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  lensAccount: Account;
  username?: string;
}

export function ProfileHeader({ lensAccount, username }: ProfileHeaderProps) {
  const displayName = lensAccount.metadata?.name || username || "User";
  const bio = lensAccount.metadata?.bio;
  const picture =
    lensAccount.metadata?.picture?.__typename === "ImageSet"
      ? lensAccount.metadata.picture.optimized?.uri
      : getStampUrl(lensAccount.address);

  // Format join date (mock for now as Lens account doesn't expose createdAt directly in this type)
  const joinDate = "Joined November 2025";

  return (
    <div className="relative mb-6 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900">
      {/* Cover Image (Banner) */}
      <div className="h-32 w-full bg-gradient-to-r from-brand-500 to-purple-600 sm:h-48"></div>

      <div className="px-4 pb-6 sm:px-8">
        <div className="relative flex flex-col items-start sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4 sm:-mt-16 sm:mb-0">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md dark:border-gray-900 sm:h-32 sm:w-32">
              <AvatarImage src={picture} alt={displayName} className="object-cover" />
              <AvatarFallback className="text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">@{username}</p>
              </div>
              <div className="mt-4 flex gap-2 sm:mt-0">
                {/* Action Buttons (Follow, Message) - Placeholders for now */}
                {/* <Button>Follow</Button> */}
              </div>
            </div>

            {bio && <p className="max-w-2xl text-base text-slate-700 dark:text-gray-300">{bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{joinDate}</span>
              </div>
              {/* Location Placeholder */}
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Ethereum</span>
              </div>
              {/* Badges Placeholder */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  Member
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
