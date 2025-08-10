"use server";

import { lensChain } from "@/lib/external/lens/chain";
import { Address } from "@/types/common";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/**
 * Gets the admin signer account from the private key
 */
export async function getAdminSigner() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is not set");
  }

  return privateKeyToAccount(privateKey as `0x${string}`);
}

/**
 * Gets the admin wallet client
 */
export async function getAdminWallet() {
  const adminSigner = await getAdminSigner();

  return createWalletClient({
    account: adminSigner,
    chain: lensChain,
    transport: http(),
  });
}
