"use client";

import React from "react";
import Link from "next/link";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { useCanEditThread } from "@/hooks/threads/use-can-edit-thread";
import { Thread } from "@/lib/domain/threads/types";
import { Edit } from "lucide-react";

interface ThreadActionsProps {
  thread: Thread;
}

export function ThreadActions({ thread }: ThreadActionsProps) {
  const { canEdit } = useCanEditThread(thread);

  return (
    <div className="mb-4 flex items-center justify-between">
      <BackNavigationLink href={thread?.community ? `/communities/${thread.community}` : "/communities"}>
        Back to Community
      </BackNavigationLink>
      {canEdit && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200 dark:hover:bg-yellow-300/40 dark:hover:text-yellow-100"
        >
          <Link href={`/thread/${thread.rootPost.slug}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Thread
          </Link>
        </Button>
      )}
    </div>
  );
}
