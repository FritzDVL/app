import { Address } from "@/types/common";
import { Post } from "@lens-protocol/client";

export interface Thread {
  id: string;
  community: Address;
  author: ThreadAuthor;
  rootPost: Post;
  title: string;
  summary: string;
  repliesCount: number;
  isVisible: boolean;
  created_at: string;
  updatedAt: string;
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
