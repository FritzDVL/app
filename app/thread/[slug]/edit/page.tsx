import React from "react";
import { ThreadEditForm } from "@/components/thread/edit/thread-edit-form";
import { getThreadBySlug } from "@/lib/services/thread/get-thread";

interface ThreadEditPageProps {
  params: { slug: string };
}

export default async function ThreadEditPage({ params }: ThreadEditPageProps) {
  const thread = await getThreadBySlug(params.slug);

  if (thread.error || !thread.thread) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-red-500">Error loading thread: {thread.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <ThreadEditForm thread={thread.thread} />
    </div>
  );
}
