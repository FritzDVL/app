const THREAD_CONTENT_PREFIX = "LensForum Thread: ";

/**
 * Adds the LensForum thread prefix to the given content and thread URL.
 */
export function addThreadContentPrefix(content: string, threadUrl: string): string {
  return `${THREAD_CONTENT_PREFIX}${threadUrl}\n\n${content}`;
}

/**
 * Removes the LensForum thread prefix from the given content if present.
 */
export function removeThreadContentPrefix(content: string): string {
  // Match only the prefix and URL at the start, up to the first double newline
  return content.replace(/^LensForum Thread: https:\/\/lensforum\.xyz\/thread\/[\w\d]+\s*\n\n/, "");
}

export { THREAD_CONTENT_PREFIX };
