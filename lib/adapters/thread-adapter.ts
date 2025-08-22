import { Thread } from "@/lib/domain/threads/types";
import { storageClient } from "@/lib/external/grove/client";
import { getTimeAgo } from "@/lib/shared/utils";
import { Address } from "@/types/common";
import { CommunityThreadSupabase } from "@/types/supabase";
import { Account, Feed, Post } from "@lens-protocol/client";

/**
 * Helper function to transform an Account to a thread author
 */
const getThreadAuthor = (author: Account) => ({
  name: author.username?.localName || "Unknown Author",
  username: author.username?.value || "unknown",
  avatar: author.metadata?.picture || "",
  reputation: author.score || 0,
  address: author.address as Address,
});

/**
 * Helper function to get title and summary based on post metadata type
 */
const getTitleAndSummary = (rootPost: Post | null, feed: Feed) => {
  if (rootPost?.metadata?.__typename === "ArticleMetadata") {
    return {
      title: rootPost.metadata.title || feed.metadata?.name || `Thread ${feed.address.slice(-6)}`,
      summary: rootPost.metadata.attributes.find(attr => attr.key === "subtitle")?.value || "",
    };
  }
  return {
    title: feed.metadata?.name || `Thread ${feed.address.slice(-6)}`,
    summary: feed.metadata?.description || "No content available",
  };
};

/**
 * Transform form data and thread record to a basic Thread object
 * Used when we have thread data but no feed details yet
 */
export const adaptFormDataToThread = (
  formData: { title: string; summary: string; tags: string; author: Address },
  threadRecord: CommunityThreadSupabase,
  communityAddress: string,
  author: Account,
  rootPost: Post | null,
): Thread => {
  const createdAt = new Date(threadRecord.created_at).toLocaleString("en-US", {
    dateStyle: "long",
  });
  return {
    id: threadRecord.lens_feed_address,
    address: threadRecord.lens_feed_address as Address,
    community: communityAddress as Address,
    title: formData.title,
    summary: formData.summary,
    author: getThreadAuthor(author),
    rootPost,
    upvotes: rootPost?.stats.upvotes || 0,
    downvotes: rootPost?.stats.downvotes || 0,
    repliesCount: threadRecord.replies_count || 0,
    timeAgo: "Just now",
    tags: [],
    created_at: createdAt,
  };
};

/**
 * Transform a Lens Feed object and thread record to a Thread object
 * Optimized version that accepts pre-fetched root post to avoid redundant API calls
 */
export const adaptFeedToThread = async (
  feed: Feed,
  threadRecord: CommunityThreadSupabase,
  author: Account,
  rootPost: Post,
): Promise<Thread> => {
  // Fetch content data
  let contentData = null;
  if (rootPost?.contentUri) {
    try {
      const resolvedUrl = storageClient.resolve(rootPost.contentUri);
      const contentResponse = await fetch(resolvedUrl);
      if (contentResponse.ok) {
        contentData = await contentResponse.json();
      }
    } catch (error) {
      console.warn(`Failed to fetch content for root post:`, error);
    }
  }

  // Get title and summary based on metadata type
  const { title, summary } = getTitleAndSummary(rootPost, feed);

  return {
    id: threadRecord.id,
    address: feed.address,
    community: threadRecord.community?.lens_group_address as Address,
    title,
    summary,
    author: getThreadAuthor(author),
    rootPost,
    upvotes: rootPost?.stats.upvotes || 0,
    downvotes: rootPost?.stats.downvotes || 0,
    repliesCount: threadRecord.replies_count || 0,
    timeAgo: getTimeAgo(new Date(threadRecord.created_at)),
    tags: contentData?.lens?.tags || contentData?.tags || [],
    created_at: threadRecord.created_at,
  };
};
