import { client } from "@/lib/clients/lens-protocol-mainnet";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Feed, evmAddress } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";

/**
 * Transform a Lens Feed object and thread record to a Thread object
 * COMMENTED OUT: Lens Protocol integration disabled
 */
export async function transformFeedToThread(feed: Feed, threadRecord: CommunityThreadSupabase): Promise<Thread> {
  const accountRequest = await fetchAccount(client, {
    address: evmAddress(threadRecord.author),
  });

  if (accountRequest.isErr()) {
    throw new Error(`Failed to fetch account: ${accountRequest.error.message}`);
  }
  const author = accountRequest.value;
  if (!author) {
    throw new Error(`Account not found for address: ${feed.owner}`);
  }

  return {
    id: feed.address,
    title: feed.metadata?.name || `Thread ${feed.address.slice(-6)}`,
    content: feed.metadata?.description || "No content available",
    author: {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
    },
    upvotes: Math.floor(Math.random() * 100) + 10, // TODO: Get real voting data
    downvotes: Math.floor(Math.random() * 10),
    replies: Math.floor(Math.random() * 50), // TODO: Get real reply count
    timeAgo: new Date(threadRecord.created_at).toLocaleDateString(),
    isPinned: false, // TODO: Add pinned logic
    isHot: Math.random() > 0.8, // TODO: Add hot logic based on recent activity
    tags: [], // TODO: Extract tags from feed metadata
    communityAddress: threadRecord.community.lens_group_address,
    created_at: threadRecord.created_at,
  };
}

/**
 * Transform form data and thread record to a basic Thread object
 * Used when we have thread data but no feed details yet
 */
export async function transformFormDataToThread(
  formData: { title: string; content: string; tags: string; author: Address },
  threadRecord: CommunityThreadSupabase,
  communityAddress: string,
): Promise<Thread> {
  const accountRequest = await fetchAccount(client, {
    address: evmAddress(formData.author),
  });

  if (accountRequest.isErr()) {
    throw new Error(`Failed to fetch account: ${accountRequest.error.message}`);
  }
  const author = accountRequest.value;
  if (!author) {
    throw new Error(`Account not found for address: ${formData.author}`);
  }

  return {
    id: threadRecord.lens_feed_address,
    title: formData.title,
    content: formData.content,
    author: {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
    },
    upvotes: 0, // New thread starts with 0 votes
    downvotes: 0,
    replies: 0, // New thread starts with 0 replies
    timeAgo: "Just now",
    isPinned: false,
    isHot: true, // New threads are considered "hot"
    tags: [],
    communityAddress: threadRecord.community?.lens_group_address || communityAddress,
    created_at: threadRecord.created_at,
  };
}
