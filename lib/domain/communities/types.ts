/**
 * Community Domain Types
 * Basic domain types for community functionality
 */
import { Address } from "@/types/common";

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
  createdAt: string; // ISO date string
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
