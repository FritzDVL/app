import { useState } from "react";
import { GroupBannedAccount, evmAddress } from "@lens-protocol/client";
import { unbanGroupAccounts } from "@lens-protocol/client/actions";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { handleOperationWith } from "@lens-protocol/client/viem";

export function useCommunityUnbanMember() {
  const [isLoading, setIsLoading] = useState(false);

  const sessionClient = useSessionClient();
  const { data: walletClient } = useWalletClient();

  const unbanMember = async (groupAddress: string, bannedAccount: GroupBannedAccount) => {
    if (!sessionClient.data) {
      toast.error("You must be logged in to manage members.");
      return false;
    }

    if (!walletClient) {
      toast.error("Wallet client is required to unban members.");
      return false;
    }

    setIsLoading(true);
    try {
      const result = await unbanGroupAccounts(sessionClient.data, {
        group: evmAddress(groupAddress),
        accounts: [evmAddress(bannedAccount.account.address)],
      }).andThen(handleOperationWith(walletClient));

      if (result.isErr()) {
        toast.error(result.error.message || "Failed to unban member");
        setIsLoading(false);
        return false;
      }
      setIsLoading(false);
      toast.success("Member unbanned successfully.");
      return true;
    } catch (e: any) {
      toast.error(e.message || "Unknown error unbanning member");
      setIsLoading(false);
      return false;
    }
  };

  return { unbanMember, isLoading };
}
