/**
 * Thread Domain Types
 * Pure domain types for thread-related business logic
 */
import { Address } from "@/types/common";
import { Post } from "@lens-protocol/client";

/**
 * Thread creation form data - domain model
 */
export interface CreateThreadFormData {
  title: string;
  summary: string;
  content: string;
  tags?: string;
  author: Address;
}

interface AuthorBase {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  address: Address;
}

export interface ThreadAuthor extends AuthorBase {}

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
