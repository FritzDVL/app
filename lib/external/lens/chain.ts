import { Env, getCurrentEnv } from "@/lib/env";
import { lens, lensTestnet } from "viem/chains";

export const lensChain = getCurrentEnv() === Env.TESTNET ? lensTestnet : lens;
