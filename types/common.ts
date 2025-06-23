export type Address = `0x${string}`;

// Base Community interface for Lens Protocol communities
export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  postCount?: number;
  threadCount?: number;
  recentActivity: string;
  isVerified?: boolean;
  avatarUrl?: string;
  picture?: string;
  trending?: boolean;
  owner?: string;
}

// Moderator interface for detailed moderator information
export interface Moderator {
  username: string;
  address: string;
  picture?: string;
  displayName: string;
}

// Extended interface for community detail pages with additional fields
export interface CommunityDetails extends Community {
  members: number; // Alias for memberCount for backward compatibility
  threads: number; // Alias for threadCount for backward compatibility
  rules?: string[]; // Optional since we use default rules
  moderators: Moderator[];
  isJoined: boolean;
  isPremium: boolean;
}

// Author interface for thread authors
export interface ThreadAuthor {
  name: string;
  username: string;
  avatar: string;
  reputation: number;
}

// Base Thread interface for forum threads
export interface Thread {
  id: string;
  title: string;
  content: string;
  author: ThreadAuthor;
  upvotes: number;
  downvotes: number;
  replies: number;
  timeAgo: string;
  isPinned: boolean;
  isHot: boolean;
  tags: string[];
  communityAddress: string;
  created_at: string;
}
