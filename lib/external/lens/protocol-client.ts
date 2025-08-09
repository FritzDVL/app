import { Env, getCurrentEnv } from "@/lib/env";
import { PublicClient, mainnet, testnet } from "@lens-protocol/client";

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

const lensMainnetClient = PublicClient.create({
  environment: mainnet,
  origin: "https://lensforum.xyz/",
  storage,
});

const lensTestnetClient = PublicClient.create({
  environment: testnet,
  origin: "http://localhost:3000/",
  storage,
});

export const client = getCurrentEnv() === Env.TESTNET ? lensTestnetClient : lensMainnetClient;
