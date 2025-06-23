import { defineChain } from "viem";

export const lensMainnet = defineChain({
  id: 232,
  name: "Lens Chain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "GHO",
    symbol: "GHO",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.lens.xyz"],
      webSocket: ["wss://rpc.lens.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.lens.xyz" },
  },
});
