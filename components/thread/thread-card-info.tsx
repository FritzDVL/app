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
    <div className="space-y-6">
      {/* Title, summary and content in one block */}
      <div className="px-0">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{title}</h1>
        {summary && <p className="mb-8 text-xl leading-relaxed text-gray-500 dark:text-gray-400">{summary}</p>}
        <div className="mt-8 flex flex-col gap-2">
          <ContentRenderer
            content={{ content, image, video }}
            className="prose prose-lg max-w-none text-foreground dark:prose-invert dark:text-gray-100"
          />
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-col gap-1 pt-4">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
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
