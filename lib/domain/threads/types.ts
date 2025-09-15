import { Address } from "@/types/common";
import { Account, Post } from "@lens-protocol/client";

export interface Thread {
  id: string;
  community: Address;
  author: Account;
  rootPost: Post;
  title: string;
  summary: string;
  repliesCount: number;
  isVisible: boolean;
  created_at: string;
  updatedAt: string;
  app?: string;
}

export interface CreateThreadFormData {
  title: string;
  summary: string;
  content: string;
  tags?: string;
  author: Address;
}
