import { client } from "../protocol-client";
import { Moderator } from "@/lib/domain/communities/types";
import { incrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { evmAddress } from "@lens-protocol/client";
import type { Group, GroupStatsResponse } from "@lens-protocol/client";
import { fetchAdminsFor, fetchGroup, fetchGroupStats, fetchGroups, joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { toast } from "sonner";

/**
 * Fetches a single group from Lens Protocol
 */
export async function fetchGroupFromLens(address: string): Promise<Group | null> {
  try {
    const result = await fetchGroup(client, { group: evmAddress(address) });

    if (result.isErr() || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error("Failed to fetch group from Lens:", error);
    throw new Error(`Failed to fetch group: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Fetches group stats from Lens Protocol
 */
export async function fetchGroupStatsFromLens(address: string): Promise<GroupStatsResponse | null> {
  try {
    const result = await fetchGroupStats(client, { group: evmAddress(address) });

    if (result.isErr() || !result.value) {
      return null;
    }

    return result.value as GroupStatsResponse;
  } catch (error) {
    console.error("Failed to fetch group stats from Lens:", error);
    throw new Error(`Failed to fetch group stats: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Fetches groups by filter from Lens Protocol
 */
export async function fetchGroupsByFilter(filter: { member?: string }) {
  try {
    const result = await fetchGroups(client, {
      filter: filter.member ? { member: evmAddress(filter.member) } : {},
    });

    if (result.isErr()) {
      console.error(result.error);
      return [];
    }

    return result.value.items || [];
  } catch (error) {
    console.error("Failed to fetch groups by filter from Lens:", error);
    throw new Error(`Failed to fetch groups: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Fetches admins/moderators for a group from Lens Protocol
 */
export async function fetchGroupAdminsFromLens(address: string): Promise<Moderator[]> {
  try {
    const result = await fetchAdminsFor(client, { address: evmAddress(address) });

    if (result.isErr()) {
      return [];
    }

    return result.value.items.map(admin => ({
      username: admin.account.username?.value || "",
      address: admin.account.address,
      picture: admin.account.metadata?.picture,
      displayName: admin.account.username?.localName || "",
    }));
  } catch (error) {
    console.error("Failed to fetch group admins from Lens:", error);
    throw new Error(`Failed to fetch group admins: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch fetch multiple groups from Lens Protocol
 */
export async function fetchGroupsBatch(addresses: string[]): Promise<Array<{ address: string; result: Group | null }>> {
  try {
    const groupPromises = addresses.map(async address => {
      const result = await fetchGroup(client, { group: evmAddress(address) });
      return {
        address,
        result: result.isOk() ? result.value : null,
      };
    });

    return await Promise.all(groupPromises);
  } catch (error) {
    console.error("Failed to batch fetch groups from Lens:", error);
    throw new Error(`Failed to batch fetch groups: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch fetch multiple group stats from Lens Protocol
 */
export async function fetchGroupStatsBatch(
  addresses: string[],
): Promise<Array<{ address: string; result: GroupStatsResponse | null }>> {
  try {
    const statsPromises = addresses.map(async address => {
      const result = await fetchGroupStats(client, { group: evmAddress(address) });
      return {
        address,
        result: result.isOk() ? (result.value as GroupStatsResponse) : null,
      };
    });

    return await Promise.all(statsPromises);
  } catch (error) {
    console.error("Failed to batch fetch group stats from Lens:", error);
    throw new Error(`Failed to batch fetch group stats: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch fetch multiple group admins from Lens Protocol
 */
export async function fetchGroupAdminsBatch(
  addresses: string[],
): Promise<Array<{ address: string; result: Moderator[] }>> {
  try {
    const adminsPromises = addresses.map(async address => {
      const moderators = await fetchGroupAdminsFromLens(address);
      return {
        address,
        result: moderators,
      };
    });

    return await Promise.all(adminsPromises);
  } catch (error) {
    console.error("Failed to batch fetch group admins from Lens:", error);
    throw new Error(`Failed to batch fetch group admins: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Joins a group and increments the community member count
 */
export async function joinAndIncrementCommunityMember(
  community: { id: string; address: string },
  sessionClient: any,
  walletClient: any,
): Promise<boolean> {
  const joinResult = await joinGroup(sessionClient, {
    group: evmAddress(community.address),
  })
    .andThen(handleOperationWith(walletClient))
    .andThen(sessionClient.waitForTransaction);

  if (joinResult.isOk()) {
    await incrementCommunityMembersCount(community.id);
    return true;
  } else {
    console.error("Error joining community:", joinResult.error);
    toast.error("Action Failed", {
      description: "Unable to update your membership status. Please try again.",
    });
    return false;
  }
}
