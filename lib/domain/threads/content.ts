/**
 * Thread Content Domain Operations
 * Pure business logic for thread content formatting
 */

const THREAD_CONTENT_PREFIX = "LensForum Thread: ";

/**
 * Adds prefix, title, and summary to content.
 */
export function formatThreadArticleContent(
  content: string,
  threadUrl: string,
  title?: string,
  summary?: string,
): string {
  const titleSection = title ? `# **${title}**\n\n` : "";
  const summarySection = summary ? `*${summary}*\n\n` : "";
  const prefixSection = `${THREAD_CONTENT_PREFIX}${threadUrl}\n\n`;
  return `${prefixSection}${titleSection}${summarySection}${content}`;
}

/**
 * Removes prefix, title, and summary from content.
 */
export function stripThreadArticleFormatting(content: string): string {
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
}

/**
 * Checks if content has the LensForum thread prefix
 * Useful for validation and content type detection
 */
export function hasThreadContentPrefix(content: string): boolean {
  return content.startsWith(`*${THREAD_CONTENT_PREFIX}`) || content.startsWith(THREAD_CONTENT_PREFIX);
}

export { THREAD_CONTENT_PREFIX };
