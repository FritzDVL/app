import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Community } from "@/lib/domain/communities/types";
import { Address } from "@/types/common";
import { User } from "lucide-react";

interface CommunityOwnerProps {
  owner: Address;
}

export function CommunityOwner({ owner }: CommunityOwnerProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <Avatar className="h-9 w-9">
        {owner.picture ? (
          <AvatarImage src={owner.picture} alt={owner.displayName || owner.username || owner.address} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">
          {owner.displayName || owner.username || "Unknown Owner"}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {owner.username ? `@${owner.username}` : owner.address}
        </div>
      </div>
      <span className="ml-auto rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        Owner
      </span>
    </div>
  );
}
