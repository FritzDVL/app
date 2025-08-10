/**
 * Get Account By Username Service
 * Fetches account data by username using Lens Protocol
 */
import { client } from "@/lib/external/lens/protocol-client";
import { Account } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";

export interface AccountResult {
  success: boolean;
  account?: Account;
  error?: string;
}

/**
 * Fetches account data by username using Lens Protocol
 */
export async function getAccountByUsername(username: string): Promise<AccountResult> {
  try {
    const accountResult = await fetchAccount(client, {
      username: { localName: username },
    });

    if (accountResult.isOk() && accountResult.value) {
      return {
        success: true,
        account: accountResult.value,
      };
    }

    return {
      success: false,
      error: "Account not found",
    };
  } catch (error) {
    console.error("Failed to fetch account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch account",
    };
  }
}
