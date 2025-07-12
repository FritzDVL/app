import { client } from "@/lib/clients/lens-protocol";
import { fetchReplies } from "@/lib/fetchers/replies";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { Reply } from "@/types/common";
import { Post as LensPost, evmAddress, postId } from "@lens-protocol/client";
import { fetchAccount, fetchPost } from "@lens-protocol/client/actions";

/**
 * Fetch a single reply/post by its ID and enrich it with Lens Protocol data.
 * @param replyId - The Lens Protocol post/reply ID
 * @returns Reply | null
 */
export async function fetchReply(replyId: string): Promise<Reply | null> {
  const result = await fetchPost(client, { post: postId(replyId) });
  if (!result.isOk() || !result.value) {
    return null;
  }

  const post = result.value as LensPost;
  if (!post.author || !post.author.address) return null;

  try {
    const accountResult = await fetchAccount(client, { address: evmAddress(post.author.address) });
    if (accountResult.isOk() && accountResult.value) {
      const author = accountResult.value;
      return transformPostToReply(post, {
        name: author.username?.localName || "Unknown Author",
        username: author.username?.value || "unknown",
        avatar: author.metadata?.picture || "",
        reputation: author.score || 0,
        address: author.address,
      });
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Fetches all replies whose parentReplyId matches the given parentId.
 * Requires threadAddress para buscar en el hilo correcto.
 */
export async function fetchRepliesByParentId(parentId: string, threadAddress?: string): Promise<Reply[]> {
  if (!threadAddress) return [];
  const allReplies = await fetchReplies(threadAddress);
  return allReplies.filter(r => r.parentReplyId === parentId);
}
