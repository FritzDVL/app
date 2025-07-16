import React from "react";
import Mention from "@/components/editor/mention";

interface MentionsRendererProps {
  content: string;
  className?: string;
}

export function MentionsRenderer({ content, className }: MentionsRendererProps) {
  const mentionRegex = /@lens\/[a-zA-Z0-9_\-.]+/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push(<Mention username={match[0]} key={`mention-${key++}`} />);
    lastIndex = mentionRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return <span className={className}>{parts}</span>;
}

export default MentionsRenderer;
