import { lensChain } from "@/lib/external/lens/chain";
import { createPublicClient, http } from "viem";

export const publicClient = createPublicClient({
  chain: lensChain,
  transport: http(),
});
