import { Post } from "@lens-protocol/client";

export type Address = `0x${string}`;

// Base Community interface for Lens Protocol communities
export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  postCount?: number;
  threadCount?: number;
  recentActivity: string;
  isVerified?: boolean;
  logo?: string | null;
  trending?: boolean;
  owner?: string;
}

// Moderator interface for detailed moderator information
export interface Moderator {
  username: string;
  address: string;
  picture?: string;
  displayName: string;
}

// Extended interface for community detail pages with additional fields
export interface CommunityDetails extends Community {
  members: number; // Alias for memberCount for backward compatibility
  threads: number; // Alias for threadCount for backward compatibility
  rules?: string[]; // Optional since we use default rules
  moderators: Moderator[];
  isJoined: boolean;
  isPremium: boolean;
}

interface AuthorBase {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
}

// Author interface for thread authors
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThreadAuthor extends AuthorBase {}

// Base Thread interface for forum threads
export interface Thread {
  id: string;
  title: string;
  summary: string;
  author: ThreadAuthor;
  rootPost: Post | null;
  upvotes: number;
  downvotes: number;
  repliesCount: number;
  timeAgo: string;
  isPinned: boolean;
  isHot: boolean;
  tags: string[];
  communityAddress: string;
  created_at: string;
  replies: Reply[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReplyAuthor extends AuthorBase {}

export interface Reply {
  id: string;
  content: string;
  author: ReplyAuthor;
  upvotes: number;
  downvotes: number;
  //nestedReplies: Reply;
  createdAt: string;
}
