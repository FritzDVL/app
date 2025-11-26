import { lensChain } from "@/lib/external/lens/chain";
import { createPublicClient, http } from "viem";

/**
 * Public client for reading blockchain data
 * Used for token balance verification and contract queries
 */
export const publicClient = createPublicClient({
  chain: lensChain,
  transport: http(),
});
