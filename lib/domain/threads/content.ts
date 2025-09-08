import { storageClient } from "@/lib/external/grove/client";
import { Address } from "@/types/common";
import { Account, Post } from "@lens-protocol/client";

export const THREAD_CONTENT_PREFIX = "LensForum Thread: ";

export const formatThreadArticleContent = (
  content: string,
  threadUrl: string,
  title?: string,
  summary?: string,
): string => {
  const titleSection = title ? `# **${title}**\n\n` : "";
  const summarySection = summary ? `*${summary}*\n\n` : "";
  const prefixSection = `${THREAD_CONTENT_PREFIX}${threadUrl}\n\n`;
  return `${prefixSection}${titleSection}${summarySection}${content}`;
};

export const stripThreadArticleFormatting = (content: string): string => {
  let result = content;

  // Step 1: Remove the prefix line
  const prefixRegex = new RegExp(
    `^${THREAD_CONTENT_PREFIX.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}https://lensforum\\.xyz/thread/[\\w\\d]+\\s*\\n+`,
  );
  result = result.replace(prefixRegex, "");

  // Step 2: Remove H1 bold title if present
  const titleRegex = /^# \*\*.*?\*\*\s*\n+/;
  result = result.replace(titleRegex, "");

  // Step 3: Remove italic summary if present
  const summaryRegex = /^\*.*?\*\s*\n+/;
  result = result.replace(summaryRegex, "");

  return result;
};

export const stripThreadPrefixOnly = (content: string): string => {
  let result = content;
  const prefixRegex = new RegExp(
    `^${THREAD_CONTENT_PREFIX.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}https://lensforum\\.xyz/thread/[\\w\\d]+\\s*\\n+`,
  );
  result = result.replace(prefixRegex, "");
  return result;
};

export const hasThreadContentPrefix = (content: string): boolean => {
  return content.startsWith(`*${THREAD_CONTENT_PREFIX}`) || content.startsWith(THREAD_CONTENT_PREFIX);
};

export const getThreadTitleAndSummary = (rootPost: Post) => {
  if (rootPost.metadata.__typename === "ArticleMetadata") {
    return {
      title: rootPost.metadata.title,
      summary: rootPost.metadata.attributes.find(attr => attr.key === "subtitle")?.value || "",
    };
  }
  return {
    title: `Thread`,
    summary: "No content available",
  };
};

export const getThreadAuthor = (author: Account) => ({
  name: author.username?.localName || "Unknown Author",
  username: author.username?.value || "unknown",
  avatar: author.metadata?.picture || "",
  reputation: author.score || 0,
  address: author.address as Address,
});

export function getThreadContent(post: Post): string {
  if (!post || !post.metadata) {
    return "";
  }
  let content = "";
  if (post.metadata.__typename === "ArticleMetadata") {
    content = post.metadata.content || "";
  }

  return stripThreadPrefixOnly(content);
}

export const getThreadTags = async (post: Post): Promise<string[]> => {
  const resolvedUrl = storageClient.resolve(post.contentUri);

  let contentData = null;
  try {
    const contentResponse = await fetch(resolvedUrl);
    if (contentResponse.ok) {
      contentData = await contentResponse.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch content for root post:`, error);
  }

  return contentData?.tags || [];
};
