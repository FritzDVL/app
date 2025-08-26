import { removeAdminFromGroup } from "@/lib/external/lens/primitives/groups";
import { SessionClient } from "@lens-protocol/client";
import { Address, WalletClient } from "viem";

export async function removeModeratorFromCommunity(
  groupAddress: Address,
  moderatorAddress: Address,
  sessionClient: SessionClient,
  walletClient: WalletClient,
): Promise<boolean> {
  return removeAdminFromGroup(moderatorAddress, groupAddress, sessionClient, walletClient);
}
