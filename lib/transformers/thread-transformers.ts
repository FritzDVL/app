import { client } from "@/lib/clients/lens-protocol-mainnet";
import { getTimeAgo } from "@/lib/utils";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Feed, Post, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPost } from "@lens-protocol/client/actions";

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

  let rootPost: Post | null = null;
  if (threadRecord.root_post_id) {
    // Fetch the root post details if available
    const rootPostRequest = await fetchPost(client, {
      post: threadRecord.root_post_id,
    });
    if (rootPostRequest.isErr()) {
      throw new Error(`Failed to fetch root post: ${rootPostRequest.error.message}`);
    }
    rootPost = rootPostRequest.value as Post;
  }

  return {
    id: feed.address,
    title: feed.metadata?.name || `Thread ${feed.address.slice(-6)}`,
    summary: feed.metadata?.description || "No content available",
    author: {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
    },
    rootPost,
    upvotes: Math.floor(Math.random() * 100) + 10, // TODO: Get real voting data
    downvotes: Math.floor(Math.random() * 10),
    repliesCount: Math.floor(Math.random() * 50), // TODO: Get real reply count
    replies: [],
    timeAgo: getTimeAgo(new Date(threadRecord.created_at)),
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
  formData: { title: string; summary: string; tags: string; author: Address },
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

  let rootPost: Post | null = null;
  if (threadRecord.root_post_id) {
    // Fetch the root post details if available
    const rootPostRequest = await fetchPost(client, {
      post: threadRecord.root_post_id,
    });
    if (rootPostRequest.isErr()) {
      throw new Error(`Failed to fetch root post: ${rootPostRequest.error.message}`);
    }
    rootPost = rootPostRequest.value as Post;
  }

  return {
    id: threadRecord.lens_feed_address,
    title: formData.title,
    summary: formData.summary,
    author: {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
    },
    rootPost,
    upvotes: 0, // New thread starts with 0 votes
    downvotes: 0,
    repliesCount: 0, // New thread starts with 0 replies
    replies: [],
    timeAgo: "Just now",
    isPinned: false,
    isHot: true, // New threads are considered "hot"
    tags: [],
    communityAddress: threadRecord.community?.lens_group_address || communityAddress,
    created_at: new Date(threadRecord.created_at).toLocaleString("en-US", {
      dateStyle: "long",
    }),
  };
}
