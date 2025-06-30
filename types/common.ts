import { Post } from "@lens-protocol/client";

export type Address = `0x${string}`;

// Base Community interface for Lens Protocol communities
export interface Community {
  id: string;
  address: Address;
  name: string;
  description: string;
  memberCount: number;
  postCount?: number;
  logo?: string | null;
  threadsCount: number;
  moderators: Moderator[];
  createdAt: string; // ISO date string
}

// Moderator interface for detailed moderator information
export interface Moderator {
  username: string;
  address: Address;
  picture?: string;
  displayName: string;
}

interface AuthorBase {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  address: Address;
}

// Author interface for thread authors
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThreadAuthor extends AuthorBase {}

// Base Thread interface for forum threads
export interface Thread {
  id: string;
  community: Address;
  address: Address;
  title: string;
  summary: string;
  author: ThreadAuthor;
  rootPost: Post | null;
  upvotes: number;
  downvotes: number;
  repliesCount: number;
  timeAgo: string;
  tags: string[];
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReplyAuthor extends AuthorBase {}

export interface Reply {
  id: string;
  thread: Address;
  content: string;
  author: ReplyAuthor;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  parentReplyId?: string;
}

// Represents a reply with depth for flattened threaded display
export type ThreadReplyWithDepth<T = any> = T & {
  _depth: number;
};

// Paginated result info type for Lens replies
export type PageInfo = {
  prev: string | null;
  next: string | null;
};

export type PaginatedRepliesResult = {
  items: Reply[];
  pageInfo: PageInfo;
};
