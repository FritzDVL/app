"use client";

import { ConnectProvider } from "@/components/providers/connect-provider";
import { Env, getCurrentEnv } from "@/lib/env";
import { client } from "@/lib/external/lens/protocol-client";
import { chains } from "@lens-chain/sdk/viem";
import { LensProvider } from "@lens-protocol/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";
import { WagmiProvider, createConfig, http } from "wagmi";

// Create a new query client for TanStack Query
const queryClient = new QueryClient();

const env = getCurrentEnv();
const isMainnet = env === Env.MAINNET;

const selectedChain = isMainnet ? chains.mainnet : chains.testnet;
const selectedRpc = isMainnet ? http("https://rpc.lens.xyz") : http("https://rpc.testnet.lens.dev");

// Create Wagmi config using ConnectKit's default configuration
const config = createConfig(
  getDefaultConfig({
    // Chains supported by your application
    chains: [selectedChain],
    transports: {
      // RPC URLs for each chain
      [selectedChain.id]: selectedRpc,
    },

    // WalletConnect project ID (required)
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

    // Required app information
    appName: "LensForum",

    // Optional app information
    appUrl: "https://lensforum.xyz/",
    appIcon: "https://lensforum.xyz/logo.png",
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
