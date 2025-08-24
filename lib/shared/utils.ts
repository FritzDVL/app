import { GROVE_API_URL } from "@/lib/shared/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/**
 * Removes trailing empty <p></p> or <p>\s*</p> tags from the end of an HTML string.
 */
export function removeTrailingEmptyPTags(html: string): string {
  return html.replace(/(?:<p>\s*<\/p>)+$/g, "");
}

export function groveLensUrlToHttp(url?: string): string {
  if (!url) return "";
  return url.startsWith("lens://") ? url.replace("lens://", GROVE_API_URL) : url;
}

export function getNotificationDate(n: any): string | undefined {
  switch (n.__typename) {
    case "MentionNotification":
      return n.post?.timestamp;
    case "CommentNotification":
      return n.comment?.timestamp;
    case "ReactionNotification":
      return n.reactions?.[0]?.reactions?.[0]?.reactedAt;
    case "TokenDistributedNotification":
      return n.actionDate;
    default:
      return n.timestamp || n.id;
  }
}
