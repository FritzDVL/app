"use client";

import React, { useEffect, useState } from "react";
import ContentRenderer from "@/components/shared/content-renderer";
import { getThreadContent, getThreadTags, getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";

interface ThreadCardInfoProps {
  thread: Thread;
}

export function ThreadCardInfo({ thread }: ThreadCardInfoProps) {
  const [tags, setTags] = useState<string[]>([]);

  const { title, summary } = getThreadTitleAndSummary(thread.rootPost);

  // Extract thread content and image
  const { content, image, video } = getThreadContent(thread.rootPost);

  useEffect(() => {
    const doFetchTags = async () => {
      const result = await getThreadTags(thread.rootPost);
      setTags(result);
    };
    doFetchTags();
  }, [thread.rootPost]);

  return (
    <div className="space-y-3">
      {/* Title, summary and content in one block */}
      <div className="px-0">
        <h1 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">{title}</h1>
        {summary && (
          <p className="mt-1 max-w-2xl text-base text-sm font-medium italic text-gray-500 dark:text-gray-400">
            {summary}
          </p>
        )}
        <div className="mt-3 flex flex-col gap-2">
          <ContentRenderer
            content={{ content, image, video }}
            className="rich-text-content rounded-2xl p-0 text-foreground dark:text-gray-100"
          />
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-col gap-1">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block rounded-full border border-gray-200 bg-transparent px-2 py-0.5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
