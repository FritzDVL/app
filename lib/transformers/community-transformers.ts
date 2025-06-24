import { Community, CommunityDetails } from "@/types/common";
import { Group } from "@lens-protocol/client";

/**
 * Transform a Lens Group object to a Community object
 */
export function transformGroupToCommunity(group: Group): Community {
  // Check if group was created recently (within last hour)
  const now = Date.now();
  const groupTimestamp = group.timestamp ? new Date(group.timestamp).getTime() : now;
  const isNewlyCreated = now - groupTimestamp < 60 * 60 * 1000; // 1 hour

  // Calculate time since creation for recent activity
  const hoursAgo = Math.floor((now - groupTimestamp) / (1000 * 60 * 60));
  const recentActivity = isNewlyCreated
    ? "Just created"
    : hoursAgo < 24
      ? `${hoursAgo} hours ago`
      : `${Math.floor(hoursAgo / 24)} days ago`;

  return {
    id: group.address,
    name: group.metadata?.name || "Unnamed Community",
    description: group.metadata?.description || "A Lens Protocol community",
    category: "Lens Protocol",
    memberCount: isNewlyCreated ? 1 : Math.floor(Math.random() * 10000) + 100,
    postCount: isNewlyCreated ? 0 : Math.floor(Math.random() * 5000) + 50,
    recentActivity,
    isVerified: true,
    trending: isNewlyCreated,
    logo: group.metadata?.icon ? group.metadata.icon : undefined,
  };
}

/**
 * Transform a Community object to a CommunityDetails object with membership information
 */
export function transformCommunityToDetails(
  community: Community,
  opts?: { isJoined?: boolean; isPremium?: boolean; logo?: string | null },
): CommunityDetails {
  return {
    ...community,
    members: community.memberCount,
    threads: community.threadCount || 0,
    moderators: [], // Will be fetched separately by components that need it
    isJoined: opts?.isJoined ?? false,
    isPremium: opts?.isPremium ?? false,
    logo: opts?.logo || community.logo,
  };
}
