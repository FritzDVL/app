import { useEffect, useState } from "react";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { transformPostToReply } from "@/lib/transformers/reply-transformer";
import { type Reply as ReplyType } from "@/types/common";
import { Post as LensPost, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchPosts } from "@lens-protocol/client/actions";

export function useThreadReplies(threadAddress: string | undefined, rootPostId: string | undefined) {
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [errorReplies, setErrorReplies] = useState<string | null>(null);

  useEffect(() => {
    if (!threadAddress || !rootPostId) return;
    setLoadingReplies(true);
    setErrorReplies(null);
    const fetchReplies = async () => {
      try {
        const result = await fetchPosts(client, {
          filter: {
            feeds: [{ feed: evmAddress(threadAddress) }],
          },
        });
        if (result.isOk() && result.value.items) {
          const validPosts = result.value.items.filter(
            (item: any) =>
              item && item.__typename === "Post" && item.author && item.author.address && item.id !== rootPostId,
          ) as LensPost[];
          validPosts.sort((a, b) => {
            const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return aTime - bTime;
          });
          const replies: ReplyType[] = [];
          for (const post of validPosts) {
            try {
              const accountResult = await fetchAccount(client, { address: evmAddress(post.author.address) });
              if (accountResult.isOk() && accountResult.value) {
                const author = accountResult.value;
                replies.push(
                  transformPostToReply(post, {
                    name: author.username?.localName || "Unknown Author",
                    username: author.username?.value || "unknown",
                    avatar: author.metadata?.picture || "",
                    reputation: author.score || 0,
                  }),
                );
              }
            } catch (err) {
              continue;
            }
          }
          setReplies(replies.slice(0, 10));
        } else {
          setReplies([]);
        }
      } catch (e) {
        setErrorReplies("Failed to fetch replies");
        setReplies([]);
      } finally {
        setLoadingReplies(false);
      }
    };
    fetchReplies();
  }, [threadAddress, rootPostId]);

  return { replies, loadingReplies, errorReplies };
}
