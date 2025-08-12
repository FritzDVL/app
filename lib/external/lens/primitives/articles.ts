/**
 * Lens Protocol Articles Primitives
 * Handles article creation and management for thread content
 */
import { formatThreadArticleContent } from "@/lib/domain/threads/content";
import { storageClient } from "@/lib/external/grove/client";
import { lensChain } from "@/lib/external/lens/chain";
import { client } from "@/lib/external/lens/protocol-client";
import { immutable } from "@lens-chain/storage-client";
import { type SessionClient, evmAddress, uri } from "@lens-protocol/client";
import type { Post } from "@lens-protocol/client";
import { fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { MetadataAttributeType, article } from "@lens-protocol/metadata";

export interface ArticleCreationData {
  title: string;
  content: string;
  summary?: string;
  author: string;
  tags?: string;
  feedAddress: string;
}

export interface ArticleCreationResult {
  success: boolean;
  post?: Post;
  error?: string;
}

/**
 * Creates an article post for a thread with proper metadata and attributes
 * This function handles the complete article creation process including:
 * - Building metadata with custom attributes
 * - Adding thread content prefix
 * - Uploading to storage
 * - Creating the post on Lens Protocol
 */
export async function createThreadArticle(
  articleData: ArticleCreationData,
  sessionClient: SessionClient,
  walletClient: any,
): Promise<ArticleCreationResult> {
  try {
    // 1. Build article attributes
    const attributes: any[] = [];
    attributes.push({ key: "author", type: MetadataAttributeType.STRING, value: articleData.author });
    attributes.push({ key: "subtitle", type: MetadataAttributeType.STRING, value: articleData.summary });

    // 2. Add thread content prefix with URL, title and summary
    const threadUrl = `https://lensforum.xyz/thread/${articleData.feedAddress}`;
    const contentWithPrefix = formatThreadArticleContent(
      articleData.content,
      threadUrl,
      articleData.title,
      articleData.summary,
    );

    // 3. Build article metadata
    const articleMetadata = article({
      title: articleData.title,
      content: contentWithPrefix,
      tags: articleData.tags ? articleData.tags.split(",").map(tag => tag.trim()) : [],
      attributes,
    });

    // 4. Upload article metadata to storage
    const acl = immutable(lensChain.id);
    const { uri: articleUri } = await storageClient.uploadAsJson(articleMetadata, { acl });

    // 5. Create the post on Lens Protocol
    const postCreationResult = await post(sessionClient, {
      contentUri: uri(articleUri),
      feed: evmAddress(articleData.feedAddress),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash: unknown) => fetchPost(client, { txHash: txHash as string }));

    if (postCreationResult.isErr()) {
      console.error("[Articles] Error creating article post:", postCreationResult.error);
      return {
        success: false,
        error: postCreationResult.error.message,
      };
    }

    const createdPost = postCreationResult.value;

    // 6. Verify it's a Post type, not a Repost
    if (createdPost && createdPost.__typename !== "Post") {
      return {
        success: false,
        error: `Unexpected post type: ${createdPost.__typename}`,
      };
    }

    return {
      success: true,
      post: createdPost as Post,
    };
  } catch (error) {
    console.error("Article creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create article",
    };
  }
}
