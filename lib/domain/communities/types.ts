import { Address } from "@/types/common";
import { GroupRule } from "@lens-protocol/client";

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
  rule: GroupRule | null;
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

export interface CreateCommunityFormData {
  name: string;
  description: string;
  adminAddress: Address;
  tags?: string;
  communityRule?: CommunityRule;
}

export type CommunityRule =
  | SimplePaymentCommunityRule
  | TokenGatedCommunityRule
  | MembershipApprovalCommunityRule
  | NoGroupRule;

export interface SimplePaymentCommunityRule extends LensGroupRule {
  type: "SimplePaymentGroupRule";
  amount: string;
  token: Address;
  recipient: Address;
}

export interface TokenGatedCommunityRule extends LensGroupRule {
  type: "TokenGatedGroupRule";
  tokenAddress: Address;
  minBalance: string;
  tokenType: "ERC20" | "ERC721" | "ERC1155";
  tokenId?: string;
}

export interface MembershipApprovalCommunityRule extends LensGroupRule {
  type: "MembershipApprovalGroupRule";
  approvers: Address[];
}

export interface NoGroupRule extends LensGroupRule {
  type: "none";
}

export interface LensGroupRule {
  type: "SimplePaymentGroupRule" | "TokenGatedGroupRule" | "MembershipApprovalGroupRule" | "none";
}
