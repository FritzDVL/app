import { lensChain } from "@/lib/chains/lens";
import { createPublicClient, http } from "viem";

export const publicClient = createPublicClient({
  chain: lensChain,
  transport: http(),
});
