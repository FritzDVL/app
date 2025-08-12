import { Address } from "@/types/common";
import { AccountMention } from "@lens-protocol/client";

interface AuthorBase {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  address: Address;
}

export interface ReplyAuthor extends AuthorBase {}

export interface Reply {
  id: string;
  thread: Address;
  content: string;
  author: ReplyAuthor;
  upvotes: number;
  downvotes: number;
  tips: number;
  mentions?: AccountMention[];
  createdAt: string;
  parentReplyId?: string;
  repliesCount: number;
}

export type ThreadReplyWithDepth<T = any> = T & {
  _depth: number;
};

export type PageInfo = {
  prev: string | null;
  next: string | null;
};

export type PaginatedRepliesResult = {
  items: Reply[];
  pageInfo: PageInfo;
};
