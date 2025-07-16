import React from "react";
import MentionsRenderer from "@/components/shared/mentions-renderer";
import ReactMarkdown from "react-markdown";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          text: ({ children }) => <MentionsRenderer content={children as string} />,
          p: ({ children }) => (
            <p>
              <MentionsRenderer content={children as string} />
            </p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default ContentRenderer;
