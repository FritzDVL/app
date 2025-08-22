import React from "react";
import Mention from "@/components/editor/mention";
import ReactMarkdown from "react-markdown";

interface ContentRendererProps {
  content: string;
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
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => renderParagraphWithMentions(children),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default ContentRenderer;
