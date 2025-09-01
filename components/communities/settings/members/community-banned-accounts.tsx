import React, { useState } from "react";
import Image from "next/image";
import { UnbanMemberDialog } from "@/components/communities/settings/members/unban-member-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunityUnbanMember } from "@/hooks/communities/use-community-unban-member";
import { GroupBannedAccount } from "@lens-protocol/client";
import { MoreHorizontal, UserCheck } from "lucide-react";

interface CommunityBannedAccountsProps {
  bannedMembers: GroupBannedAccount[];
  groupAddress: string;
  onUnban: (account: GroupBannedAccount) => void;
}

export function CommunityBannedAccounts({ bannedMembers, groupAddress, onUnban }: CommunityBannedAccountsProps) {
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<GroupBannedAccount | null>(null);
  const { unbanMember, isLoading } = useCommunityUnbanMember();

  const handleUnbanClick = (account: GroupBannedAccount) => {
    setSelectedAccount(account);
    setShowUnbanDialog(true);
  };

  const handleConfirmUnban = async () => {
    if (!selectedAccount) return;

    const success = await unbanMember(groupAddress, selectedAccount);
    if (success) {
      onUnban(selectedAccount);
    }
    setShowUnbanDialog(false);
    setSelectedAccount(null);
  };

  return (
    <div className="py-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        Banned Accounts
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {bannedMembers.length}
        </span>
      </h3>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {bannedMembers.map(ban => {
          const { account, bannedAt, bannedBy } = ban;
          const avatarUrl = account.metadata?.picture || "/logo.png";
          const username = account.username?.localName || account.username?.value || "Unknown";
          const name = account.metadata?.name || username;
          return (
            <li
              key={account.address}
              className="relative flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
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
                      onClick={() => handleUnbanClick(ban)}
                      className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 dark:focus:bg-green-900/20 dark:focus:text-green-400"
                    >
                      <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                      Unban member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Image
                src={avatarUrl}
                alt={username}
                className="h-12 w-12 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                width={48}
                height={48}
              />
              <div className="min-w-0 flex-1 pr-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="truncate text-base font-semibold text-foreground">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">@{username}</span>
                </div>
                <div className="mt-1 break-all font-mono text-xs text-gray-500">{account.address}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Banned: {new Date(bannedAt).toLocaleDateString()} by{" "}
                  {bannedBy?.username?.localName || bannedBy?.username?.value || bannedBy?.address}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <UnbanMemberDialog
        open={showUnbanDialog}
        onOpenChange={setShowUnbanDialog}
        selectedAccount={selectedAccount}
        onConfirm={handleConfirmUnban}
        isLoading={isLoading}
      />
    </div>
  );
}
