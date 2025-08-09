// import { lensMainnet } from "../chains/lens-mainnet";
import { lensChain } from "@/lib/chains/lens";
import { Address } from "@/types/common";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("APP_PRIVATE_KEY environment variable is not set");
}

export const adminSigner = privateKeyToAccount(privateKey as Address);

export const adminWallet = createWalletClient({
  account: adminSigner,
  chain: lensChain,
  transport: http(),
});
