import { Address } from "@/types/common";
import { Post } from "@lens-protocol/client";

export interface Reply {
  id: string;
  thread: Address;
  post: Post;
}

export interface ReplyAuthor {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  address: Address;
}
