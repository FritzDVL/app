import { Post } from "@lens-protocol/client";

export type Address = `0x${string}`;

// Base Community interface for Lens Protocol communities
export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount?: number;
  logo?: string | null;
  threadsCount: number;
  moderators: Moderator[];
}

// Moderator interface for detailed moderator information
export interface Moderator {
  username: string;
  address: string;
  picture?: string;
  displayName: string;
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
  communityId: string;
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
  threadId: string;
  content: string;
  author: ReplyAuthor;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  parentReplyId?: string;
}
