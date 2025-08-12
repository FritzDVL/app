"use server";

import { client } from "@/lib/external/lens/protocol-client";
import { evmAddress } from "@lens-protocol/client";
import type { Account } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";

/**
 * Fetches an account from Lens Protocol
 */
export async function fetchAccountFromLens(address: string): Promise<Account | null> {
  try {
    const result = await fetchAccount(client, {
      address: evmAddress(address),
    });

    if (result.isErr() || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error("Failed to fetch account from Lens:", error);
    throw new Error(`Failed to fetch account: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch fetch multiple accounts from Lens Protocol
 */
export async function fetchAccountsBatch(
  addresses: string[],
): Promise<Array<{ address: string; result: Account | null }>> {
  try {
    const accountPromises = addresses.map(async address => {
      const result = await fetchAccount(client, { address: evmAddress(address) });
      return {
        address,
        result: result.isOk() ? result.value : null,
      };
    });

    return await Promise.all(accountPromises);
  } catch (error) {
    console.error("Failed to batch fetch accounts from Lens:", error);
    throw new Error(`Failed to batch fetch accounts: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
