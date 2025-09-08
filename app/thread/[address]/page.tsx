import { ProtectedRoute } from "@/components/pages/protected-route";
import { Thread } from "@/components/thread/thread";
import { getThreadTitleAndSummary } from "@/lib/domain/threads/content";
import { getCommunity } from "@/lib/services/community/get-community";
import { getThread } from "@/lib/services/thread/get-thread";
import { Address } from "@/types/common";

const MAX_TITLE_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 160;

export async function generateMetadata({ params }: { params: { address: string } }) {
  const thread = await getThread(params.address);
  if (thread.error || !thread.thread) {
    return {
      title: "Thread on LensForum",
      description: "Join the discussion!",
      openGraph: {
        title: "Thread on LensForum",
        description: "Join the discussion!",
        images: ["/logo.png"],
      },
      twitter: {
        card: "summary",
        title: "Thread on LensForum",
        description: "Join the discussion!",
        images: ["/logo.png"],
      },
    };
  }
  const rootPost = thread.thread.rootPost;

  const t = getThreadTitleAndSummary(rootPost);
  let title = t.title || "Thread on LensForum";
  let description = t.summary || "Join the discussion!";

  // Truncate title and description for social sharing
  if (title.length > MAX_TITLE_LENGTH) {
    title = title.slice(0, MAX_TITLE_LENGTH - 1) + "…";
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    description = description.slice(0, MAX_DESCRIPTION_LENGTH - 1) + "…";
  }
  const image = "/logo.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [image],
    },
  };
}

// Server Component
export default async function ThreadPage({ params }: { params: { address: string } }) {
  const threadAddress = params.address as Address;

  const thread = await getThread(threadAddress);
  console.log("Thread fetch result:", thread.thread?.community);
  if (thread.error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-red-500">Error loading thread: {thread.error}</p>
      </div>
    );
  }
  if (!thread.thread) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">Thread not found</p>
      </div>
    );
  }

  const community = thread ? await getCommunity(thread.thread.community) : null;
  if (community?.error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-red-500">Error loading community: {community.error}</p>
      </div>
    );
  }
  if (!community?.community) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">Community not found</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Thread thread={thread.thread} community={community.community} />
    </ProtectedRoute>
  );
}
