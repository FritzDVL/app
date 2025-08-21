import React from "react";
import ReactMarkdown from "react-markdown";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default ContentRenderer;
