import { Address } from "@/types/common";
import { Group } from "@lens-protocol/client";

export interface Community {
  id: string;
  name: string;
  group: Group;
  moderators: Moderator[];
  postCount?: number;
  memberCount: number;
  threadsCount: number;
  isVisible: boolean;
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
