import { Address } from "@/types/common";
import { Feed, Post } from "@lens-protocol/client";

export interface Thread {
  id: string;
  feed: Feed;
  community: Address;
  rootPost: Post;
  author: ThreadAuthor;
  repliesCount: number;
  timeAgo: string;
  created_at: string;
}

export interface CreateThreadFormData {
  title: string;
  summary: string;
  content: string;
  tags?: string;
  author: Address;
}

interface ThreadAuthor {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  address: Address;
}
