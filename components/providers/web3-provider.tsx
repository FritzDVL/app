"use client";

import { ConnectProvider } from "@/components/providers/connect-provider";
// import { lensMainnet } from "@/lib/chains/lens-mainnet";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { LensProvider } from "@lens-protocol/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";
import { lensTestnet } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";

// Create a new query client for TanStack Query
const queryClient = new QueryClient();

// Create Wagmi config using ConnectKit's default configuration
const config = createConfig(
  getDefaultConfig({
    // Chains supported by your application
    chains: [lensTestnet],
    transports: {
      // RPC URLs for each chain
      // [lensMainnet.id]: http("https://rpc.lens.xyz"),
      [lensTestnet.id]: http("https://rpc.testnet.lens.dev"),
    },

    // WalletConnect project ID (required)
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

    // Required app information
    appName: "LensForum",

    // Optional app information
    appUrl: "https://lens-forum.vercel.app/",
    appIcon: "https://lens-forum.vercel.app/logo.png",
  }),
);

// Provider component that wraps the application
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LensProvider client={client}>
          <ConnectProvider>{children}</ConnectProvider>
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
