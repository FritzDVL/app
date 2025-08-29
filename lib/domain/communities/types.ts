import { Address } from "@/types/common";
import { GroupRules } from "@lens-protocol/client";

export interface Community {
  id: string;
  address: Address;
  name: string;
  description: string;
  memberCount: number;
  postCount?: number;
  logo?: string | undefined;
  threadsCount: number;
  moderators: Moderator[];
  owner: Address;
  rules?: GroupRules;
  createdAt: string;
}

export interface Moderator {
  username: string;
  address: Address;
  picture?: string;
  displayName: string;
}

export type ForumStats = {
  members: number;
  threads: number;
  communities: number;
};
