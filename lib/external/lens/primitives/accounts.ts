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
