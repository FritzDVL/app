import React from "react";
import { htmlFromMarkdown } from "@/lib/prosekit/markdown";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const html = htmlFromMarkdown(content);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default ContentRenderer;
