/**
 * Thread Content Domain Operations
 * Pure business logic for thread content formatting
 */

const THREAD_CONTENT_PREFIX = "LensForum Thread: ";

/**
 * Adds prefix, title, and summary to content.
 */
export function addThreadContentPrefix(content: string, threadUrl: string, title?: string, summary?: string): string {
  const titleSection = title ? `# **${title}**\n\n` : "";
  const summarySection = summary ? `*${summary}*\n\n` : "";
  const prefixSection = `${THREAD_CONTENT_PREFIX}${threadUrl}\n\n`;
  return `${prefixSection}${titleSection}${summarySection}${content}`;
}

/**
 * Removes prefix, title, and summary from content.
 */
export function removeThreadContentPrefix(content: string): string {
  return content.replace(
    /^LensForum Thread: https:\/\/lensforum\.xyz\/thread\/[\w\d]+\s*\n\n(# \*\*.*\*\*\n\n)?(\*.*\*\n\n)?/,
    "",
  );
}

/**
 * Checks if content has the LensForum thread prefix
 * Useful for validation and content type detection
 */
export function hasThreadContentPrefix(content: string): boolean {
  return content.startsWith(`*${THREAD_CONTENT_PREFIX}`) || content.startsWith(THREAD_CONTENT_PREFIX);
}

export { THREAD_CONTENT_PREFIX };
