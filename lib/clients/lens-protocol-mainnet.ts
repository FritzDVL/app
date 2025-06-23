import { PublicClient, mainnet } from "@lens-protocol/client";

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

export const client = PublicClient.create({
  environment: mainnet,
  origin: "https://lensjudge.xyz",
  storage,
});
