/**
 * Community Domain Operations
 * Basic operations for community management
 */

/**
 * Parse and normalize tags from string input
 */
export function parseAndNormalizeTags(tagsString: string): string[] {
  if (!tagsString.trim()) return [];

  return tagsString
    .split(",")
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .slice(0, 5); // Max 5 tags
}
