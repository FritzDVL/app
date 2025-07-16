import { Reply, ReplyAuthor } from "@/types/common";
import { Post } from "@lens-protocol/client";

/**
 * Transforms a Lens Post object into a Reply (ReplyPost) object for the forum
 */
export function transformPostToReply(post: Post, author: ReplyAuthor): Reply {
  return {
    id: post.id,
    thread: post.feed?.address,
    content: typeof post.metadata === "object" && "content" in post.metadata ? String(post.metadata.content) : "",
    author,
    upvotes: post.stats?.upvotes ?? 0,
    mentions: Array.isArray(post.mentions)
      ? post.mentions.filter(mention => mention.__typename === "AccountMention")
      : [],
    tips: post.stats.tips ?? 0,
    parentReplyId: post.commentOn?.id ?? undefined,
    repliesCount: post.stats?.comments ?? 0,
    downvotes: post.stats?.downvotes ?? 0,
    createdAt: post.timestamp ? new Date(post.timestamp).toISOString() : new Date().toISOString(),
  };
}
