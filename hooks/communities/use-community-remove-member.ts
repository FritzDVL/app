import { useState } from "react";
import { GroupMember, evmAddress } from "@lens-protocol/client";
import { removeGroupMembers } from "@lens-protocol/client/actions";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";

interface UseCommunityRemoveMemberResult {
  removeMember: (groupAddress: string, member: GroupMember, ban: boolean) => Promise<boolean>;
  isLoading: boolean;
}

export function useCommunityRemoveMember(): UseCommunityRemoveMemberResult {
  const [isLoading, setIsLoading] = useState(false);
  const sessionClient = useSessionClient();

  const removeMember = async (groupAddress: string, member: GroupMember, ban: boolean) => {
    if (!sessionClient.data) {
      toast.error("You must be logged in to manage members.");
      return false;
    }

    setIsLoading(true);
    try {
      const result = await removeGroupMembers(sessionClient.data, {
        group: evmAddress(groupAddress),
        accounts: [evmAddress(member.account.address)],
        ban,
      });
      if (result.isErr()) {
        toast.error(result.error.message || "Failed to remove member");
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      toast.success(ban ? "Member removed and banned successfully." : "Member removed successfully.");
      return true;
    } catch (e: any) {
      toast.error(e.message || "Unknown error removing member");
      setIsLoading(false);
      return false;
    }
  };

  return { removeMember, isLoading };
}
