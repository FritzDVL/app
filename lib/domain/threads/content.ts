/**
 * Thread Content Domain Operations
 * Pure business logic for thread content formatting
 */

const THREAD_CONTENT_PREFIX = "LensForum Thread: ";

/**
 * Adds the LensForum thread prefix to the given content and thread URL.
 * Domain rule: All thread content should be prefixed with forum identifier
 */
export function addThreadContentPrefix(content: string, threadUrl: string): string {
  return `${THREAD_CONTENT_PREFIX}${threadUrl}\n\n${content}`;
}

/**
 * Removes the LensForum thread prefix from the given content if present.
 * Used when displaying content to users (clean format)
 */
export function removeThreadContentPrefix(content: string): string {
  // Match only the prefix and URL at the start, up to the first double newline
  return content.replace(/^LensForum Thread: https:\/\/lensforum\.xyz\/thread\/[\w\d]+\s*\n\n/, "");
}

/**
 * Checks if content has the LensForum thread prefix
 * Useful for validation and content type detection
 */
export function hasThreadContentPrefix(content: string): boolean {
  return content.startsWith(THREAD_CONTENT_PREFIX);
}

export { THREAD_CONTENT_PREFIX };
