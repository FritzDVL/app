"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { revalidatePathAction } from "@/app/actions/revalidate";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { useIsModerator } from "@/hooks/communities/use-is-moderator";
import { useCanEditThread } from "@/hooks/threads/use-can-edit-thread";
import { usePinThread } from "@/hooks/threads/use-pin-thread";
import { useThreadVisibility } from "@/hooks/threads/use-thread-visibility";
import { Community } from "@/lib/domain/communities/types";
import { Thread } from "@/lib/domain/threads/types";
import { Edit } from "lucide-react";
import { Pin, PinOff } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ThreadActionsProps {
  thread: Thread;
  community: Community;
}

export function ThreadActions({ thread, community }: ThreadActionsProps) {
  const { canEdit } = useCanEditThread(thread);
  const { isModerator } = useIsModerator(community);
  const { togglePin, isPending } = usePinThread();
  const { toggleVisibility, isPending: isVisibilityPending } = useThreadVisibility();
  const router = useRouter();

  const handlePin = async () => {
    try {
      const newPinnedState = !thread.featured; // Assuming thread type has featured, if not we need to add it
      await togglePin(thread.id, newPinnedState);
      await revalidatePathAction(`/thread/${thread.slug}`);
      await revalidatePathAction(`/communities/${thread.community}`);
      toast.success(newPinnedState ? "Thread pinned" : "Thread unpinned");
      router.refresh();
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  const handleVisibility = async () => {
    try {
      const newVisibleState = !thread.isVisible;
      await toggleVisibility(thread.id, newVisibleState);
      await revalidatePathAction(`/thread/${thread.slug}`);
      await revalidatePathAction(`/communities/${thread.community}`);
      toast.success(newVisibleState ? "Thread visible" : "Thread hidden");
      router.refresh();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <BackNavigationLink href={thread?.community ? `/communities/${thread.community}` : "/communities"}>
        Back to Community
      </BackNavigationLink>
      <div className="flex gap-2">
        {isModerator && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePin}
              disabled={isPending}
              className="border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {thread.featured ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVisibility}
              disabled={isVisibilityPending}
              className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              {thread.isVisible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Unhide
                </>
              )}
            </Button>
          </>
        )}
        {canEdit && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200 dark:hover:bg-yellow-300/40 dark:hover:text-yellow-100"
          >
            <Link href={`/thread/${thread.slug}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Thread
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
