"use client";

import React, { useState } from "react";
import { ThreadEditForm } from "@/components/thread/edit/thread-edit-form";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { useCanEditThread } from "@/hooks/threads/use-can-edit-thread";
import { Thread } from "@/lib/domain/threads/types";
import { Edit } from "lucide-react";

interface ThreadActionsProps {
  thread: Thread;
}

export function ThreadActions({ thread }: ThreadActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { canEdit } = useCanEditThread(thread);

  if (isEditing) {
    return <ThreadEditForm thread={thread} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <BackNavigationLink href={thread?.community ? `/communities/${thread.community}` : "/communities"}>
        Back to Community
      </BackNavigationLink>
      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="border border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 dark:border-yellow-400 dark:bg-yellow-300/20 dark:text-yellow-200 dark:hover:bg-yellow-300/40 dark:hover:text-yellow-100"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Thread
        </Button>
      )}
    </div>
  );
}
