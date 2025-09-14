import React from "react";
import Image from "next/image";
import Mention from "@/components/editor/mention";
import { MediaImage, MediaVideo } from "@lens-protocol/client";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface ContentRendererProps {
  content: string | { content: string; image?: MediaImage; video?: MediaVideo };
  className?: string;
}

const MENTION_REGEX = /(@lens\/[a-zA-Z0-9_\-.]+)/g;

function processMentionText(text: string, baseKey: string | number): React.ReactNode[] {
  const parts = text.split(MENTION_REGEX);

  return parts.map((part, index) => {
    if (part.match(/^@lens\/[a-zA-Z0-9_\-.]+$/)) {
      return <Mention key={`${baseKey}-${index}`} username={part} />;
    }
    return part;
  });
}

function renderParagraphWithMentions(children: React.ReactNode): React.ReactElement {
  const childrenArray = React.Children.toArray(children);
  const hasMentions = childrenArray.some(child => typeof child === "string" && child.includes("@lens/"));

  if (!hasMentions) {
    return <p>{children}</p>;
  }

  const processedChildren = childrenArray.map((child, index) => {
    if (typeof child === "string" && child.includes("@lens/")) {
      return processMentionText(child, index);
    }
    return child;
  });

  return <p>{processedChildren}</p>;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  // Handle both string and object content types
  const textContent = typeof content === "string" ? content : content.content;
  const image = typeof content === "object" ? content.image : undefined;
  const video = typeof content === "object" ? content.video : undefined;

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => renderParagraphWithMentions(children),
        }}
      >
        {textContent}
      </ReactMarkdown>

      {/* Render image if present */}
      {image && (
        <div className="mt-4 flex justify-center">
          <Image
            src={image.item}
            alt={image.altTag || "Content image"}
            className="max-h-96 rounded-xl border bg-gray-50 object-contain dark:bg-gray-900"
            width={image.width || 500}
            height={image.height || 300}
          />
        </div>
      )}

      {/* Render video if present */}
      {video && (
        <div className="mt-4 flex justify-center">
          <video
            src={video.item}
            controls
            className="max-h-96 rounded-xl border bg-gray-50 object-contain dark:bg-gray-900"
          />
        </div>
      )}
    </div>
  );
}

export default ContentRenderer;
