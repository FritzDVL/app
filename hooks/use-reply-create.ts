import { useAuthStore } from "@/stores/auth-store";
import type { Reply as ReplyType } from "@/types/common";

export function useReplyCreate() {
  const { account } = useAuthStore();

  function createReply(content: string): ReplyType | null {
    if (!content.trim()) return null;
    return {
      id: Date.now().toString(),
      content,
      author: {
        name: account?.username?.localName || "",
        username: account?.username?.value || "",
        avatar: account?.metadata?.picture,
        reputation: account?.score || 0,
      },
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };
  }

  return { createReply };
}
