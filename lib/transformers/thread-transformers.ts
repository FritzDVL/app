import { client } from "@/lib/clients/lens-protocol-mainnet";
import { getTimeAgo } from "@/lib/utils";
import { Address, Thread } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Account, Feed, Post } from "@lens-protocol/client";
import { fetchPost } from "@lens-protocol/client/actions";

/**
 * Transform a Lens Feed object and thread record to a Thread object
 */
export async function transformFeedToThread(
  feed: Feed,
  threadRecord: CommunityThreadSupabase,
  author: Account,
): Promise<Thread> {
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
    address: feed.address,
    community: threadRecord.community?.lens_group_address as Address,
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
    // repliesCount: threadRecord.replies_count || 0,
    repliesCount: 0,
    timeAgo: getTimeAgo(new Date(threadRecord.created_at)),
    tags: [], // TODO: Extract tags from feed metadata
    created_at: threadRecord.created_at,
  };
}

/**
 * Transform form data and thread record to a basic Thread object
 * Used when we have thread data but no feed details yet
 * Now expects author and rootPost to be provided.
 */
export function transformFormDataToThread(
  formData: { title: string; summary: string; tags: string; author: Address },
  threadRecord: CommunityThreadSupabase,
  communityAddress: string,
  author: Account,
  rootPost: Post | null,
): Thread {
  return {
    id: threadRecord.lens_feed_address,
    address: threadRecord.lens_feed_address as Address,
    community: communityAddress as Address,
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
    timeAgo: "Just now",
    tags: [],
    created_at: new Date(threadRecord.created_at).toLocaleString("en-US", {
      dateStyle: "long",
    }),
  };
}
