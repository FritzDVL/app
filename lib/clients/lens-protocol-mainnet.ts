import { PublicClient, testnet } from "@lens-protocol/client";

const storage = typeof window !== "undefined" ? window.localStorage : undefined;

export const client = PublicClient.create({
  environment: testnet,
  origin: "https://lens-forum.vercel.app/",
  storage,
});
