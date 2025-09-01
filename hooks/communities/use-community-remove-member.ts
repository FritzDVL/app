import { useState } from "react";
import { GroupMember, evmAddress } from "@lens-protocol/client";
import { banGroupAccounts, removeGroupMembers } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

interface UseCommunityRemoveMemberResult {
  removeMember: (groupAddress: string, member: GroupMember, ban: boolean) => Promise<boolean>;
  isLoading: boolean;
}

export function useCommunityRemoveMember(): UseCommunityRemoveMemberResult {
  const [isLoading, setIsLoading] = useState(false);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const removeMember = async (groupAddress: string, member: GroupMember, ban: boolean) => {
    if (!sessionClient.data) {
      toast.error("You must be logged in to manage members.");
      return false;
    }
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to remove a member.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // First, remove the member from the group
      const removeResult = await removeGroupMembers(sessionClient.data, {
        group: evmAddress(groupAddress),
        accounts: [evmAddress(member.account.address)],
      })
        .andThen(handleOperationWith(walletClient.data))
        .andThen(sessionClient.data.waitForTransaction);

      if (removeResult.isErr()) {
        toast.error(removeResult.error.message || "Failed to remove member");
        setIsLoading(false);
        return false;
      }

      // If ban is true, also ban the account
      if (ban) {
        const banResult = await banGroupAccounts(sessionClient.data, {
          group: evmAddress(groupAddress),
          accounts: [evmAddress(member.account.address)],
        })
          .andThen(handleOperationWith(walletClient.data))
          .andThen(sessionClient.data.waitForTransaction);

        if (banResult.isErr()) {
          toast.error(banResult.error.message || "Member removed but failed to ban");
          setIsLoading(false);
          return false;
        }
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
