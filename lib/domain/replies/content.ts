import { Post } from "@lens-protocol/client";

export const getReplyContent = (reply: Post) =>
  reply.metadata.__typename === "ArticleMetadata" ? reply.metadata.content : "";
