import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getReplyContent } from "@/lib/domain/replies/content";
import { Reply } from "@/lib/domain/replies/types";
import { getReply } from "@/lib/services/reply/get-reply";
import { getTimeAgo, removeTrailingEmptyPTags } from "@/lib/shared/utils";
import { ChevronDown } from "lucide-react";

interface ThreadInReplyToProps {
  parentId: string;
  rootPostId: string;
}

export function ThreadInReplyTo({ parentId, rootPostId }: ThreadInReplyToProps) {
  const [showContext, setShowContext] = useState(false);
  const [inReplyTo, setInReplyTo] = useState<Reply[]>([]);
  const [loadingContext, setLoadingContext] = useState(false);

  // Recursively fetch in-reply-to chain, stopping at rootPostId
  const fetchInReplyToChain = async (pid: string, acc: Reply[] = []): Promise<Reply[]> => {
    if (!pid || pid === rootPostId) return acc;
    const result = await getReply(pid);
    if (!result.success || !result.reply || result.reply.id === rootPostId) return acc;
    acc.unshift(result.reply); // prepend for top-down order
    if (result.reply.post.commentOn?.id && result.reply.post.commentOn.id !== rootPostId) {
      return fetchInReplyToChain(result.reply.post.commentOn.id, acc);
    }
    return acc;
  };

  // Toggle context. Fetch chain only once (when first opening) to avoid repeated loads.
  const handleShowContext = async () => {
    if (!showContext) {
      if (inReplyTo.length === 0) {
        setLoadingContext(true);
        try {
          const chain = await fetchInReplyToChain(parentId);
          setInReplyTo(chain);
        } finally {
          setLoadingContext(false);
        }
      }
      setShowContext(true);
    } else {
      // simply hide the context (do not clear cache so reopening is instant)
      setShowContext(false);
    }
  };

  const controlLabel = loadingContext
    ? "Loading…"
    : inReplyTo.length
      ? `In reply to (${inReplyTo.length})`
      : "In reply to";

  const chainId = `in-reply-to-${parentId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div>
      {/* Minimal disguised control: subtle inline button with chevron; improved accessibility */}
      <div>
        <button
          type="button"
          onClick={handleShowContext}
          disabled={loadingContext}
          aria-expanded={showContext}
          aria-controls={chainId}
          aria-pressed={showContext}
          aria-label={showContext ? "Hide parent replies" : "Show parent replies"}
          className={"inline-flex items-center gap-2 text-xs transition-colors focus:outline-none disabled:opacity-50"}
          title={showContext ? "Hide context" : "Show context"}
        >
          <span className="sr-only">In reply to</span>
          <span className="inline-block">{controlLabel}</span>
          <span
            className={`ml-1 inline-block transition-transform duration-150 ${showContext ? "rotate-180" : ""}`}
            aria-hidden
          >
            <ChevronDown className="h-3 w-3" />
          </span>
        </button>
      </div>

      {/* When hidden, nothing from the chain is rendered; when shown, render the chain (cached after first load) */}
      {showContext && inReplyTo.length > 0 && (
        <div id={chainId} className="mt-2 flex flex-col gap-2">
          {inReplyTo.map((reply, idx) => {
            const ctxContent = getReplyContent(reply.post);
            return (
              <div key={reply.id} className="relative flex items-start gap-2 pl-3">
                {/* Vertical line for chain */}
                {idx < inReplyTo.length - 1 && (
                  <span
                    className="absolute left-0 top-5 h-full w-px bg-brand-100 dark:bg-gray-600"
                    style={{ minHeight: 32 }}
                  />
                )}
                <Avatar className="mt-0.5 h-4 w-4">
                  <AvatarImage src={reply.post.author.metadata?.picture} />
                  <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-[9px] text-white">
                    {reply.post.author.metadata?.name?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded border border-brand-100 bg-slate-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {reply.post.author.metadata?.name}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {getTimeAgo(new Date(reply.post.timestamp))}
                    </span>
                  </div>
                  <div
                    className="rich-text-content text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: removeTrailingEmptyPTags(ctxContent) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
