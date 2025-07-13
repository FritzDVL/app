import ContentRenderer from "@/components/shared/content-renderer";
import { Thread } from "@/types/common";

export function TextOnlyMetadataContent({ thread }: { thread: Thread }) {
  if (!thread.rootPost || !thread.rootPost.metadata || !thread.rootPost.metadata) {
    return <div className="text-gray-500">No content available for this thread.</div>;
  }
  return (
    <div className="my-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
        <span>
          Posted on{" "}
          {thread.rootPost.timestamp
            ? new Date(thread.rootPost.timestamp).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })
            : "Unknown date"}
        </span>
      </div>
      <ContentRenderer
        content={
          "content" in thread.rootPost.metadata
            ? ((thread.rootPost.metadata as { content?: string }).content ?? "")
            : ""
        }
        className="rich-text-content rounded-2xl bg-slate-50/50 p-5 text-gray-800"
      />
    </div>
  );
}
