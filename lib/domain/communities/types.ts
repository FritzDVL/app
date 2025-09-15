import { Address } from "@/types/common";
import { Feed, Group } from "@lens-protocol/client";

export interface Community {
  id: string;
  name: string;
  group: Group;
  feed: Feed;
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
