/**
 * Reply Service
 * Orchestrates reply operations using existing hooks and external layer
 */
import { adaptPostToReply } from "@/lib/adapters/reply-adapter";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import {
  fetchAccountsBatch,
  fetchAllThreadPosts,
  fetchPostsByAuthor,
  fetchThreadPosts,
} from "@/lib/external/lens/primitives/replies";
import { client } from "@/lib/external/lens/protocol-client";
import { incrementThreadRepliesCount } from "@/lib/external/supabase/threads";
import { Address, Reply, ReplyAuthor } from "@/types/common";
import { immutable } from "@lens-chain/storage-client";
import { PageSize, Post, evmAddress, postId, uri } from "@lens-protocol/client";
import { fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { textOnly } from "@lens-protocol/metadata";

export interface CreateReplyResult {
  success: boolean;
  reply?: Reply;
  error?: string;
}

export interface PaginatedRepliesResult {
  success: boolean;
  data?: {
    replies: Reply[];
    pageInfo: any;
  };
  error?: string;
}

export interface RepliesResult {
  success: boolean;
  replies?: Reply[];
  error?: string;
}

/**
 * Creates a reply using existing logic from useReplyCreate hook
 */
export async function createReply(
  parentId: string,
  content: string,
  threadAddress: Address,
  threadId: string,
  sessionClient: any,
  walletClient: any,
  replyAuthor: ReplyAuthor,
): Promise<CreateReplyResult> {
  try {
    if (!sessionClient) {
      return {
        success: false,
        error: "No session client available",
      };
    }

    // 1. Create metadata
    const metadata = textOnly({ content });

    // 2. Upload metadata to storage
    const acl = immutable(lensChain.id);
    const { uri: replyUri } = await storageClient.uploadAsJson(metadata, { acl });

    // 3. Post to Lens Protocol - using the correct API structure
    const result = await post(sessionClient, {
      contentUri: uri(replyUri),
      commentOn: { post: postId(parentId) },
      feed: evmAddress(threadAddress),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash: unknown) => fetchPost(client, { txHash: txHash as string }));

    if (result.isErr()) {
      const errorMessage =
        result.error && typeof result.error === "object" && "message" in result.error
          ? (result.error as any).message
          : "Failed to create reply";
      return {
        success: false,
        error: errorMessage,
      };
    }

    const createdPost = result.value as Post;

    // 4. Increment thread replies count
    try {
      await incrementThreadRepliesCount(threadId);
    } catch (error) {
      console.warn("Failed to increment thread replies count:", error);
      // Don't fail the entire operation for this
    }

    // 5. Transform post to reply - using the correct author parameter
    const reply = adaptPostToReply(createdPost, replyAuthor);

    return {
      success: true,
      reply,
    };
  } catch (error) {
    console.error("Reply creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create reply",
    };
  }
}

/**
 * Gets replies for a thread with pagination using service approach
 */
export async function getThreadReplies(
  threadAddress: string,
  pageSize: PageSize = PageSize.Fifty,
  cursor?: string | null,
): Promise<PaginatedRepliesResult> {
  try {
    // 1. Fetch posts with pagination
    const { posts, pageInfo } = await fetchThreadPosts(threadAddress, pageSize, cursor);

    if (!posts.length) {
      return {
        success: true,
        data: {
          replies: [],
          pageInfo,
        },
      };
    }

    // 2. Extract unique author addresses for batching
    const authorAddresses = [...new Set(posts.map(post => post.author.address))];

    // 3. Batch fetch all authors
    const authorResults = await fetchAccountsBatch(authorAddresses);

    // 4. Create lookup map for O(1) access
    const authorMap = new Map();
    authorResults.forEach(({ address, result }) => {
      authorMap.set(address, result);
    });

    // 5. Transform posts to replies using cached author data
    const replies: Reply[] = [];
    for (const post of posts) {
      try {
        const author = authorMap.get(post.author.address);

        if (!author) {
          console.warn(`Missing author data for post ${post.id}:`, {
            authorAddress: post.author.address,
          });
          continue;
        }

        replies.push(
          adaptPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
            address: author.address,
          }),
        );
      } catch (error) {
        console.warn(`Error transforming post ${post.id}:`, error);
        continue;
      }
    }

    return {
      success: true,
      data: {
        replies,
        pageInfo,
      },
    };
  } catch (error) {
    console.error("Failed to fetch thread replies:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch thread replies",
    };
  }
}

/**
 * Gets all replies for a thread (non-paginated) using service approach
 */
export async function getAllThreadReplies(threadAddress: string): Promise<RepliesResult> {
  try {
    // 1. Fetch all posts for the thread
    const posts = await fetchAllThreadPosts(threadAddress);

    if (!posts.length) {
      return {
        success: true,
        replies: [],
      };
    }

    // 2. Extract unique author addresses for batching
    const authorAddresses = [...new Set(posts.map(post => post.author.address))];

    // 3. Batch fetch all authors
    const authorResults = await fetchAccountsBatch(authorAddresses);

    // 4. Create lookup map for O(1) access
    const authorMap = new Map();
    authorResults.forEach(({ address, result }) => {
      authorMap.set(address, result);
    });

    // 5. Transform posts to replies using cached author data
    const replies: Reply[] = [];
    for (const post of posts) {
      try {
        const author = authorMap.get(post.author.address);

        if (!author) {
          console.warn(`Missing author data for post ${post.id}:`, {
            authorAddress: post.author.address,
          });
          continue;
        }

        replies.push(
          adaptPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
            address: author.address,
          }),
        );
      } catch (error) {
        console.warn(`Error transforming post ${post.id}:`, error);
        continue;
      }
    }

    return {
      success: true,
      replies,
    };
  } catch (error) {
    console.error("Failed to fetch all thread replies:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch all thread replies",
    };
  }
}

/**
 * Gets latest replies by author using service approach
 */
export async function getLatestRepliesByAuthor(author: Address, limit: number = 10): Promise<RepliesResult> {
  try {
    // 1. Fetch latest posts by author
    const posts = await fetchPostsByAuthor(author, limit);

    if (!posts.length) {
      return {
        success: true,
        replies: [],
      };
    }

    // 2. Transform posts to replies (author info is already available in posts)
    const replies: Reply[] = [];
    for (const post of posts) {
      try {
        replies.push(
          adaptPostToReply(post, {
            name: post.author.username?.localName || "Unknown Author",
            username: post.author.username?.value || "unknown",
            avatar: post.author.metadata?.picture || "",
            reputation: post.author.score || 0,
            address: post.author.address,
          }),
        );
      } catch (error) {
        console.warn(`Error transforming post ${post.id}:`, error);
        continue;
      }
    }

    return {
      success: true,
      replies,
    };
  } catch (error) {
    console.error("Failed to fetch latest replies by author:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch latest replies by author",
    };
  }
}

/**
 * Gets a single reply by ID using service approach
 */
export async function getReply(replyId: string): Promise<{
  success: boolean;
  reply?: Reply;
  error?: string;
}> {
  try {
    const result = await fetchPost(client, { post: postId(replyId) });

    if (!result.isOk() || !result.value) {
      return {
        success: false,
        error: "Reply not found",
      };
    }

    const post = result.value as Post;
    if (!post.author || !post.author.address) {
      return {
        success: false,
        error: "Invalid reply data",
      };
    }

    // Fetch author account
    const authorResults = await fetchAccountsBatch([post.author.address]);
    const author = authorResults[0]?.result;

    if (!author) {
      return {
        success: false,
        error: "Author not found",
      };
    }

    const reply = adaptPostToReply(post, {
      name: author.username?.localName || "Unknown Author",
      username: author.username?.value || "unknown",
      avatar: author.metadata?.picture || "",
      reputation: author.score || 0,
      address: author.address,
    });

    return {
      success: true,
      reply,
    };
  } catch (error) {
    console.error("Failed to fetch reply:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reply",
    };
  }
}

/**
 * Gets replies by parent ID using service approach
 */
export async function getRepliesByParentId(parentId: string, threadAddress?: string): Promise<RepliesResult> {
  try {
    if (!threadAddress) {
      return {
        success: true,
        replies: [],
      };
    }

    // Get all thread replies first
    const result = await getAllThreadReplies(threadAddress);
    if (!result.success || !result.replies) {
      return result;
    }

    // Filter by parent ID
    const filteredReplies = result.replies.filter(r => r.parentReplyId === parentId);

    return {
      success: true,
      replies: filteredReplies,
    };
  } catch (error) {
    console.error("Failed to fetch replies by parent ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch replies by parent ID",
    };
  }
}
