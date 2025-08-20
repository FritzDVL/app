"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Community, Moderator } from "@/lib/domain/communities/types";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface CommunityModeratorsManagerProps {
  community: Community;
}

export function CommunityModeratorsManager({ community }: CommunityModeratorsManagerProps) {
  const [moderators, setModerators] = useState<Moderator[]>(community.moderators || []);
  const [newModeratorAddress, setNewModeratorAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingModerator, setRemovingModerator] = useState<Moderator | null>(null);

  const handleAddModerator = async () => {
    if (!newModeratorAddress.trim()) {
      toast.error("Please enter a valid address");
      return;
    }

    // Basic address validation (should start with 0x and be 42 characters)
    if (!newModeratorAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    // Check if moderator already exists
    if (moderators.some(mod => mod.address.toLowerCase() === newModeratorAddress.toLowerCase())) {
      toast.error("This address is already a moderator");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement add moderator service
      // This would typically call an API endpoint to add the moderator
      // and fetch the user's profile information from Lens

      // For now, we'll create a mock moderator
      const newModerator: Moderator = {
        address: newModeratorAddress as `0x${string}`,
        username: `user-${newModeratorAddress.slice(-6)}`,
        displayName: `User ${newModeratorAddress.slice(-6)}`,
        picture: undefined,
      };

      setModerators(prev => [...prev, newModerator]);
      setNewModeratorAddress("");

      toast.success("Moderator added successfully!", {
        description: "The new moderator has been added to your community.",
      });

      console.log("Adding moderator:", newModeratorAddress);
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
      // TODO: Implement remove moderator service
      // This would typically call an API endpoint to remove the moderator

      setModerators(prev => prev.filter(mod => mod.address !== moderator.address));
      setRemovingModerator(null);

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
        <div className="flex space-x-3">
          <div className="flex-1">
            <Label htmlFor="moderator-address" className="sr-only">
              Moderator Address
            </Label>
            <Input
              id="moderator-address"
              value={newModeratorAddress}
              onChange={e => setNewModeratorAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="rounded-xl"
            />
          </div>
          <Button
            onClick={handleAddModerator}
            disabled={loading || !newModeratorAddress.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 font-semibold text-white hover:from-blue-600 hover:to-blue-700"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Add a wallet address to make them a moderator of this community.
        </p>
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
