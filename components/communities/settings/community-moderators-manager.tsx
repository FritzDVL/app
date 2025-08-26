"use client";

import { useState } from "react";
import { revalidateCommunityPath } from "@/app/actions/revalidate-path";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserSearch } from "@/components/ui/user-search";
import { AccountSuggestion } from "@/hooks/editor/use-account-search";
import { Community, Moderator } from "@/lib/domain/communities/types";
import { addModeratorToCommunity } from "@/lib/services/community/add-moderator";
import { removeModeratorFromCommunity } from "@/lib/services/community/remove-moderator";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

interface CommunityModeratorsManagerProps {
  community: Community;
}

export function CommunityModeratorsManager({ community }: CommunityModeratorsManagerProps) {
  const [moderators, setModerators] = useState<Moderator[]>(community.moderators || []);
  const [loading, setLoading] = useState(false);
  const [removingModerator, setRemovingModerator] = useState<Moderator | null>(null);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  // Get current moderator addresses to exclude from search results
  const currentModeratorAddresses = moderators.map(mod => mod.address);

  const handleAddModerator = async (account: AccountSuggestion) => {
    if (!sessionClient || !sessionClient.data) {
      toast.error("Login to add moderators");
      return;
    }
    if (!walletClient || !walletClient.data) {
      toast.error("Connect your wallet to add moderators");
      return;
    }

    // Check if user is already a moderator
    if (moderators.some(mod => mod.address.toLowerCase() === account.address.toLowerCase())) {
      toast.error("This user is already a moderator");
      return;
    }

    setLoading(true);

    try {
      const ok = await addModeratorToCommunity(
        community.address as Address,
        account.address as Address,
        sessionClient.data,
        walletClient.data,
      );
      if (!ok) {
        throw new Error("Service returned false");
      }

      // Convert MentionAccount to Moderator
      const newModerator: Moderator = {
        address: account.address as Address,
        username: account.username || account.displayUsername,
        displayName: account.name || account.displayUsername || `User ${account.address.slice(-6)}`,
        picture: account.picture,
      };

      setModerators(prev => [...prev, newModerator]);

      // Revalidate the community path after adding a moderator
      await revalidateCommunityPath(community.address);

      toast.success("Moderator added successfully!", {
        description: `${newModerator.displayName} has been added as a moderator.`,
      });
    } catch (error) {
      console.error("Error adding moderator:", error);
      toast.error("Failed to add moderator", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveModerator = async (moderator: Moderator) => {
    setLoading(true);

    try {
      if (!sessionClient || !sessionClient.data) {
        toast.error("Login to add moderators");
        return;
      }
      if (!walletClient || !walletClient.data) {
        toast.error("Connect your wallet to add moderators");
        return;
      }
      const ok = await removeModeratorFromCommunity(
        community.address as Address,
        moderator.address as Address,
        sessionClient.data,
        walletClient.data,
      );
      if (!ok) {
        throw new Error("Service returned false");
      }

      setModerators(prev => prev.filter(mod => mod.address !== moderator.address));
      setRemovingModerator(null);

      // Revalidate the community path after removing a moderator
      await revalidateCommunityPath(community.address);

      toast.success("Moderator removed successfully!", {
        description: "The moderator has been removed from your community.",
      });

      console.log("Removing moderator:", moderator.address);
    } catch (error) {
      console.error("Error removing moderator:", error);
      toast.error("Failed to remove moderator", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Moderator */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Add New Moderator</h3>
        <div className="space-y-3">
          <UserSearch
            onUserSelect={handleAddModerator}
            placeholder="Search for a user by username..."
            disabled={loading}
            excludeAddresses={currentModeratorAddresses}
          />
          <p className="text-xs text-muted-foreground">
            Search and select a user to make them a moderator of this community.
          </p>
        </div>
      </div>

      {/* Current Moderators */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Current Moderators ({moderators.length})</h3>

        {moderators.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <UserPlus className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-sm text-muted-foreground">No moderators assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moderators.map(moderator => (
              <div
                key={moderator.address}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={moderator.picture || "/placeholder.svg"} alt={moderator.displayName} />
                    <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                      {moderator.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{moderator.displayName || "Unknown User"}</p>
                    <p className="text-sm text-muted-foreground">
                      {moderator.username ? `@${moderator.username.replace("lens/", "")}` : "No username"} •{" "}
                      {moderator.address}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRemovingModerator(moderator)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Moderator Confirmation Dialog */}
      <AlertDialog open={!!removingModerator} onOpenChange={open => !open && setRemovingModerator(null)}>
        <AlertDialogContent className="rounded-3xl bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Moderator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{removingModerator?.displayName}</strong> as a moderator? They
              will no longer have moderation privileges in this community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removingModerator && handleRemoveModerator(removingModerator)}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
