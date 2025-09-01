import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { GroupMember } from "@lens-protocol/client";
import { UserMinus } from "lucide-react";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: GroupMember | null;
  onConfirm: (member: GroupMember, ban: boolean) => void;
  isLoading?: boolean;
}

export function RemoveMemberDialog({
  open,
  onOpenChange,
  member,
  onConfirm,
  isLoading = false,
}: RemoveMemberDialogProps) {
  const [banUser, setBanUser] = useState(false);

  useEffect(() => {
    if (!open) {
      setBanUser(false);
    }
  }, [open]);

  if (!member) return null;

  const username = member.account.username?.localName || member.account.username?.value || "Unknown";

  const handleConfirm = () => {
    onConfirm(member, banUser);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md rounded-3xl bg-white p-8 backdrop-blur-sm dark:border-gray-600/60 dark:bg-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <span className="inline-block rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-2 text-white">
              <UserMinus className="h-6 w-6" />
            </span>
            Remove member
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="py-4 text-base text-muted-foreground">
          Are you sure you want to remove <strong>@{username}</strong> from this community?
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex-1">
                <div className="font-medium text-foreground">Ban user</div>
                <div className="text-sm text-muted-foreground">Prevent this user from rejoining the community</div>
              </div>
              <Switch checked={banUser} onCheckedChange={setBanUser} className="ml-4" />
            </div>

            {banUser && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  ⚠️ Banned users cannot rejoin this community
                </p>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex flex-row justify-end gap-3">
          <AlertDialogCancel className="rounded-full bg-muted px-6 py-2 font-semibold text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-muted/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`rounded-full px-6 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 ${
              banUser
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            }`}
          >
            {isLoading ? "Removing..." : banUser ? "Remove and ban" : "Remove member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
