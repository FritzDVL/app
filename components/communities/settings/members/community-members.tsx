import { useState } from "react";
import { CommunityMemberCard } from "@/components/communities/settings/members/community-user-card";
import { RemoveMemberDialog } from "@/components/communities/settings/members/remove-member-dialog";
import { CursorPagination } from "@/components/shared/cursor-pagination";
import { useCommunityMembers } from "@/hooks/communities/use-community-members";
import { useCommunityRemoveMember } from "@/hooks/communities/use-community-remove-member";
import { Community } from "@/lib/domain/communities/types";
import { GroupMember } from "@lens-protocol/client";
import { UserMinus } from "lucide-react";

interface CommunityMembersProps {
  community: Community;
}

export function CommunityMembers({ community }: CommunityMembersProps) {
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  const { removeMember, isLoading } = useCommunityRemoveMember();
  const { members, loading, removeMemberFromList, hasNext, hasPrev, next, previous } = useCommunityMembers(community);

  const handleRemove = async (memberToRemove: GroupMember, ban: boolean) => {
    const success = await removeMember(community.group.address, memberToRemove, ban);
    if (success) {
      removeMemberFromList(memberToRemove);
    }
  };

  return (
    <>
      {loading && <div className="text-center text-muted-foreground">Loading members…</div>}
      {!loading && members.length === 0 && <div className="text-center text-muted-foreground">No members found.</div>}
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {members.map(member => {
          const avatarUrl = member.account.metadata?.picture || "/logo.png";
          const username = member.account.username?.localName || member.account.username?.value || "Unknown";
          const name = member.account.metadata?.name || username;
          const joinedAt = member.joinedAt
            ? new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(
                new Date(member.joinedAt),
              )
            : null;
          return (
            <CommunityMemberCard
              key={member.account.address}
              avatarUrl={avatarUrl}
              name={name}
              username={username}
              actionButton={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 dark:hover:text-red-300"
                  disabled={isLoading}
                  onClick={() => setMemberToRemove(member)}
                >
                  <UserMinus className="mr-1 h-4 w-4 text-red-500" />
                  Remove
                </button>
              }
              meta={joinedAt ? <>Joined: {joinedAt}</> : <>Joined: -</>}
            />
          );
        })}
      </ul>
      <RemoveMemberDialog
        open={!!memberToRemove}
        onOpenChange={open => !open && setMemberToRemove(null)}
        member={memberToRemove}
        onConfirm={handleRemove}
        isLoading={isLoading}
      />
      <CursorPagination hasPrev={hasPrev} hasNext={hasNext} loading={loading} onPrev={previous} onNext={next} />
    </>
  );
}
