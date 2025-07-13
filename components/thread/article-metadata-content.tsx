import ContentRenderer from "@/components/shared/content-renderer";

export function ArticleMetadataContent({ content }: { content: string }) {
  return (
    <ContentRenderer
      content={content}
      className="rich-text-content whitespace-pre-line rounded-2xl bg-slate-50/50 p-5 text-gray-800"
    />
  );
}
