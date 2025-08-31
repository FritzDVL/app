import { useEffect, useState } from "react";
import { ReplySharedCard } from "@/components/reply/reply-shared-card";
import { getReply } from "@/lib/services/reply/get-reply";
import { Post, ReferencedPost } from "@lens-protocol/client";

export function ReplyToSharedCard({ reply }: { reply: ReferencedPost | null }) {
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);

  useEffect(() => {
    const doFetchReplyingTo = async () => {
      if (!reply?.id) return;
      const replyingTo = await getReply(reply.id);
      if (replyingTo.success && replyingTo.reply) {
        setReplyingTo(replyingTo.reply?.post);
      }
    };
    doFetchReplyingTo();
  }, [reply]);

  if (!replyingTo) {
    return null;
  }

  return <ReplySharedCard reply={replyingTo} />;
}
