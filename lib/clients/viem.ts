import { lensMainnet } from "../chains/lens-mainnet";
import { createPublicClient, http } from "viem";

export const publicClient = createPublicClient({
  chain: lensMainnet,
  transport: http(),
});
