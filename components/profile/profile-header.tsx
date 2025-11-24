import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getStampUrl } from "@/lib/utils/get-stamp-url";
import { Account } from "@lens-protocol/client";
import { ChevronsUpDown, Mail } from "lucide-react";

interface ProfileHeaderProps {
  lensAccount: Account;
  username?: string;
}

export function ProfileHeader({ lensAccount, username }: ProfileHeaderProps) {
  const displayName = lensAccount.metadata?.name || username || "User";
  const picture =
    lensAccount.metadata?.picture?.__typename === "ImageSet"
      ? lensAccount.metadata.picture.optimized?.uri
      : getStampUrl(lensAccount.address);

  return (
    <div className="mb-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-white shadow-sm dark:border-gray-900 sm:h-32 sm:w-32">
            <AvatarImage src={picture} alt={displayName} className="object-cover" />
            <AvatarFallback className="text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
            <p className="text-base font-medium text-slate-500 dark:text-gray-400">{displayName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="bg-[#00a2ff] text-white hover:bg-[#008ecc]">
            <Mail className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button
            variant="outline"
            className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronsUpDown className="mr-2 h-4 w-4" />
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
}
