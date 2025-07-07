import React from "react";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import ReactMarkdown from "react-markdown";

interface ContentRendererProps {
  content: string;
  className?: string;
}

// Custom mention renderer for [@username](mention:user:id) and [#tag](mention:tag:id)
function MentionLink(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
  const { href, children } = props;
  if (!href) return <span>{children}</span>;
  // Parse href like 'mention:user:123' or 'mention:tag:456'
  const match = href.match(/^mention:(user|tag):(.+)$/);
  if (match) {
    const kind = match[1];
    const id = match[2];
    const className = kind === "user" ? "mention-user" : "mention-tag";
    return (
      <span data-mention={kind} data-id={id} className={className} contentEditable={false}>
        {children}
      </span>
    );
  }
  // fallback to normal link
  return <a {...props}>{children}</a>;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: MentionLink,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default ContentRenderer;
