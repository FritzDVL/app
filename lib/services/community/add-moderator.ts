import { addAdminToGroup } from "@/lib/external/lens/primitives/groups";
import { SessionClient } from "@lens-protocol/client";
import { Address, WalletClient } from "viem";

export async function addModeratorToCommunity(
  groupAddress: Address,
  moderatorAddress: Address,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<boolean> {
  return addAdminToGroup(moderatorAddress, groupAddress, sessionClient, walletClient);
}
