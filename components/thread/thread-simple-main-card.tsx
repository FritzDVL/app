import ContentRenderer from "@/components/shared/content-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";

function getThreadContent(thread: Thread): string {
  const metadata = thread?.rootPost?.metadata;
  if (metadata && typeof metadata === "object" && "content" in metadata) {
    return metadata.content ?? "";
  }
  return "";
}

export function ThreadSimpleMainCard({ thread }: { thread: any }) {
  return (
    <div>
      <Card className="rounded-lg bg-gray-50/50 shadow-sm dark:border-gray-700/40 dark:bg-gray-800/50">
        <CardContent className="p-4">
          {thread && (
            <div className="space-y-3">
              {/* Thread Title */}
              <div>
                <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                  {thread.title || "Untitled Thread"}
                </h3>
              </div>

              {/* Thread Content Preview - Truncated */}
              {getThreadContent(thread) && (
                <div className="line-clamp-3 text-sm text-muted-foreground">
                  <ContentRenderer
                    content={stripThreadArticleFormatting(getThreadContent(thread)).slice(0, 200) + "..."}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Thread Stats - Pretty formatted */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-3 text-xs text-muted-foreground dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="font-medium">{thread.repliesCount || 0}</span>
                  <span>replies</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>by</span>
                  <span className="font-medium">{thread.author?.name || "Unknown"}</span>
                </div>
                {thread.created_at && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
