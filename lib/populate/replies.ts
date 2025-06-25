import { client } from "@/lib/clients/lens-protocol-mainnet";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { Reply } from "@/types/common";
import { Post as LensPost, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPosts } from "@lens-protocol/client/actions";

/**
 * Fetches all replies for a given thread address and root post id, enriches them with Lens Protocol data, and returns a Reply[] array.
 * @param threadAddress - The Lens Protocol thread address
 * @param rootPostId - The root post id to exclude from replies
 */
export async function populateReplies(threadAddress: string, rootPostId: string): Promise<Reply[]> {
  const result = await fetchPosts(client, {
    filter: {
      feeds: [{ feed: evmAddress(threadAddress) }],
    },
  });
  if (!result.isOk() || !result.value.items) return [];
  const validPosts = result.value.items.filter(
    (item: any) => item && item.__typename === "Post" && item.author && item.author.address && item.id !== rootPostId,
  ) as LensPost[];
  validPosts.sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });
  const replies: Reply[] = [];
  for (const post of validPosts) {
    try {
      const accountResult = await fetchAccount(client, { address: evmAddress(post.author.address) });
      if (accountResult.isOk() && accountResult.value) {
        const author = accountResult.value;
        replies.push(
          transformPostToReply(post, {
            name: author.username?.localName || "Unknown Author",
            username: author.username?.value || "unknown",
            avatar: author.metadata?.picture || "",
            reputation: author.score || 0,
          }),
        );
      }
    } catch {
      continue;
    }
  }
  return replies;
}
