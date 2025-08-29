import { Reply, ReplyAuthor } from "@/lib/domain/replies/types";
import { Post } from "@lens-protocol/client";

/**
 * Transforms a Lens Post object into a Reply (ReplyPost) object for the forum
 */
export function adaptPostToReply(post: Post): Reply {
  return {
    id: post.id,
    thread: post.feed.address,
    post,
  };
}
