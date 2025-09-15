import { stripThreadArticleFormatting } from "../threads/content";
import { MediaImage, MediaVideo, Post } from "@lens-protocol/client";

export function getReplyContent(post: Post): { content: string; image?: MediaImage; video?: MediaVideo } {
  if (!post || !post.metadata) {
    return { content: "" };
  }
  let content = "";
  if (post.metadata.__typename === "ArticleMetadata") {
    content = stripThreadArticleFormatting(post.metadata.content);
    return { content };
  }

  if (post.metadata.__typename === "TextOnlyMetadata") {
    content = post.metadata.content;
    return { content };
  }

  if (post.metadata.__typename === "ImageMetadata") {
    content = post.metadata.content;
    return {
      content,
      image: post.metadata.image,
    };
  }

  if (post.metadata.__typename === "VideoMetadata") {
    content = post.metadata.content;

    return {
      content,
      video: post.metadata.video,
    };
  }
  return {
    content: "",
    image: undefined,
  };
}
