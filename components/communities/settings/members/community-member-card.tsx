import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunityRemoveMember } from "@/hooks/communities/use-community-remove-member";
import { Community } from "@/lib/domain/communities/types";
import { GroupMember } from "@lens-protocol/client";
import { MoreHorizontal, UserMinus } from "lucide-react";

interface CommunityMemberCardProps {
  member: GroupMember;
  community: Community;
  canRemove: boolean;
  onRemove?: (member: GroupMember, ban: boolean) => void;
}

export function CommunityMemberCard({ member, community, canRemove, onRemove }: CommunityMemberCardProps) {
  const { account, joinedAt } = member;
  const avatarUrl = account.metadata?.picture || "/logo.png";
  const username = account.username?.localName || account.username?.value || "Unknown";
  const name = account.metadata?.name || username;

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { removeMember, isLoading } = useCommunityRemoveMember();

  const handleRemove = async (memberToRemove: GroupMember, ban: boolean) => {
    const success = await removeMember(community.group.address, memberToRemove, ban);
    if (success) {
      onRemove?.(memberToRemove, ban);
    }
  };

  return (
    <li>
      <div className="relative flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {canRemove && (
          <div className="absolute right-4 top-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border border-border bg-white shadow-xl dark:bg-gray-800"
              >
                <DropdownMenuItem
                  onClick={() => setShowRemoveDialog(true)}
                  className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:focus:bg-red-900/20 dark:focus:text-red-400"
                >
                  <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                  Remove member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Link href={`/u/${username}`} className="flex min-w-0 flex-1 items-center gap-4 pr-8">
          <Image
            src={avatarUrl}
            alt={username}
            className="h-14 w-14 rounded-full border border-gray-200 object-cover dark:border-gray-700"
            width={56}
            height={56}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="truncate text-base font-semibold text-foreground">{name}</span>
              <span className="truncate text-xs text-muted-foreground">@{username}</span>
            </div>
            <div className="mt-1 break-all font-mono text-xs text-gray-500">{account.address}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Joined: {joinedAt ? new Date(joinedAt).toLocaleDateString() : "-"}
            </div>
          </div>
        </Link>
      </div>

      <RemoveMemberDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        member={member}
        onConfirm={handleRemove}
        isLoading={isLoading}
      />
    </li>
  );
}
