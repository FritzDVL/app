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
  const regex = new RegExp(`^${THREAD_CONTENT_PREFIX}https:\/\/lensforum\.xyz\/thread\/[^\s]+\s*\n\n?`, "i");
  return content.replace(regex, "");
}

export { THREAD_CONTENT_PREFIX };
