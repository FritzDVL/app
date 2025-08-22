import { Thread } from "@/lib/domain/threads/types";

interface ThreadDebugInfoProps {
  thread: Thread;
}

export function ThreadDebugInfo({ thread }: ThreadDebugInfoProps) {
  return (
    <div className="mt-4 rounded-lg bg-gray-100 p-3 text-xs dark:bg-gray-700">
      <p>
        <strong>Thread ID:</strong> {thread.id}
      </p>
      <p>
        <strong>Root Post ID:</strong> {thread.rootPost?.id || "No rootPost"}
      </p>
      <p>
        <strong>Author:</strong> {thread.author.address}
      </p>
      <p>
        <strong>Content URI:</strong> {thread.rootPost?.contentUri || "N/A"}
      </p>
      <p>
        <strong>Metadata Type:</strong> {thread.rootPost?.metadata?.__typename || "N/A"}
      </p>
    </div>
  );
}
