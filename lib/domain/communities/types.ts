/**
 * Community Domain Types
 * Basic domain types for community functionality
 */
import { Address } from "@/types/common";

/**
 * Community creation form data - domain model
 */
export interface CreateCommunityFormData {
  name: string;
  description: string;
  adminAddress: Address;
  tags?: string;
}

export interface Community {
  id: string;
  address: Address;
  name: string;
  description: string;
  memberCount: number;
  postCount?: number;
  logo?: string | null;
  threadsCount: number;
  moderators: Moderator[];
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
