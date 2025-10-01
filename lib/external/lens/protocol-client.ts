import { fragments } from "@/fragments";
import { Env, getCurrentEnv } from "@/lib/env";
import { APP_URL } from "@/lib/shared/constants";
import { PublicClient, mainnet, testnet } from "@lens-protocol/client";

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

const lensMainnetClient = PublicClient.create({
  environment: mainnet,
  origin: `${APP_URL}/`,
  storage,
  fragments,
});

const lensTestnetClient = PublicClient.create({
  environment: testnet,
  origin: `${APP_URL}/`,
  storage,
  fragments,
});

export const client = getCurrentEnv() === Env.TESTNET ? lensTestnetClient : lensMainnetClient;
