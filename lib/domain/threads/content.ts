import { storageClient } from "@/lib/external/grove/client";
import { Address } from "@/types/common";
import { Account, MediaImage, MediaVideo, Post } from "@lens-protocol/client";

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

export const getThreadTitleAndSummary = (rootPost: Post): { title: string; summary: string } => {
  if (rootPost.metadata.__typename === "ArticleMetadata") {
    return {
      title: rootPost.metadata.title || "Untitled Thread",
      summary: rootPost.metadata.attributes.find(attr => attr.key === "subtitle")?.value || "",
    };
  } else if (rootPost.metadata?.__typename === "TextOnlyMetadata") {
    if (rootPost.metadata?.content) {
      return {
        title: rootPost.metadata.content.split(" ").slice(0, 8).join(" ") + "...",
        summary: rootPost.metadata.content.split(" ").slice(0, 20).join(" ") + "...",
      };
    }
  } else if (rootPost.metadata?.__typename === "ImageMetadata") {
    if (rootPost.metadata?.content) {
      return {
        title: rootPost.metadata.content.split(" ").slice(0, 8).join(" ") + "...",
        summary: rootPost.metadata.content.split(" ").slice(0, 20).join(" ") + "...",
      };
    }
  } else if (rootPost.metadata?.__typename === "VideoMetadata") {
    if (rootPost.metadata?.content) {
      return {
        title: rootPost.metadata.content.split(" ").slice(0, 8).join(" ") + "...",
        summary: rootPost.metadata.content.split(" ").slice(0, 20).join(" ") + "...",
      };
    }
  }
  return {
    title: "",
    summary: "",
  };
};

export const getThreadAuthor = (author: Account) => ({
  name: author.username?.localName || "Unknown Author",
  username: author.username?.value || "unknown",
  avatar: author.metadata?.picture || "",
  reputation: author.score || 0,
  address: author.address as Address,
});

export function getThreadContent(post: Post): { content: string; image?: MediaImage; video?: MediaVideo } {
  if (!post || !post.metadata) {
    return { content: "" };
  }
  let content = "";
  if (post.metadata.__typename === "ArticleMetadata") {
    content = stripThreadArticleFormatting(post.metadata.content);
    return { content };
  }

  if (post.metadata.__typename === "TextOnlyMetadata") {
    content = post.metadata.content;
    return { content };
  }

  if (post.metadata.__typename === "ImageMetadata") {
    content = post.metadata.content;
    // Return both text and image object for rendering
    return {
      content,
      image: post.metadata.image,
    };
  }

  if (post.metadata.__typename === "VideoMetadata") {
    content = post.metadata.content;

    return {
      content,
      video: post.metadata.video,
    };
  }
  return {
    content: "",
    image: undefined,
  };
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
