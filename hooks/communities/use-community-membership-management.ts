import { useCallback, useEffect, useState } from "react";
import { Community } from "@/lib/domain/communities/types";
import { Account, GroupMembershipRequest, PaginatedResultInfo, evmAddress } from "@lens-protocol/client";
import {
  approveGroupMembershipRequests,
  cancelGroupMembershipRequest,
  fetchGroupMembershipRequests,
} from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useCommunityMembershipManagement(community: Community) {
  const [requests, setRequests] = useState<GroupMembershipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo | null>(null);

  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const groupAddress = community?.group?.address;

  const fetchRequests = useCallback(
    async (cursor?: string | null) => {
      if (!sessionClient.data) {
        toast.error("Not logged in", {
          description: "Please log in to view membership requests.",
        });
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await fetchGroupMembershipRequests(sessionClient.data, {
          group: evmAddress(groupAddress),
          ...(cursor ? { cursor } : {}),
        });
        if (result.isErr()) {
          setError(result.error.message || "Failed to fetch membership requests");
          setLoading(false);
          return;
        }
        const { items, pageInfo } = result.value;
        setRequests(Array.from(items));
        setPageInfo(pageInfo);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [groupAddress, sessionClient.data],
  );

  useEffect(() => {
    if (groupAddress && sessionClient.data) {
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupAddress, sessionClient.data]);

  const handleApprove = async (requester: Account) => {
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to approve membership requests.",
      });
      return;
    }
    try {
      const request = requests.find(req => req.account.address === requester.address);
      if (!request) throw new Error("Request not found");
      if (!sessionClient.data) throw new Error("No session client");
      const result = await approveGroupMembershipRequests(sessionClient.data, {
        group: evmAddress(groupAddress),
        accounts: [evmAddress(request.account.address)],
      }).andThen(handleOperationWith(walletClient.data));
      if (result.isErr()) {
        setError(result.error.message || "Failed to approve request");
        return;
      }
      setRequests(prev => prev.filter(req => req.account.address !== requester.address));
    } catch (error: any) {
      setError(error.message || "Failed to approve request");
      console.error("Failed to approve request:", error);
    } finally {
    }
  };

  const handleReject = async (requester: Account) => {
    if (!walletClient.data) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to approve membership requests.",
      });
      return;
    }
    try {
      if (!sessionClient.data) throw new Error("No session client");
      const result = await cancelGroupMembershipRequest(sessionClient.data, {
        group: evmAddress(groupAddress),
      }).andThen(handleOperationWith(walletClient.data));
      if (result.isErr()) {
        setError(result.error.message || "Failed to reject request");
        return;
      }
      setRequests(prev => prev.filter(req => req.account.address !== requester.address));
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Failed to reject request:", error);
      setError(errMsg || "Failed to reject request");
    } finally {
    }
  };

  return {
    requests,
    loading,
    error,
    pageInfo,
    fetchRequests,
    handleApprove,
    handleReject,
  };
}
