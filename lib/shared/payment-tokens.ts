import { isMainnet } from "@/lib/env";

export const PAYMENT_TOKENS = {
  mainnet: [{ value: "0x000000000000000000000000000000000000800A", label: "GHO", symbol: "GHO" }],
  testnet: [{ value: "0x000000000000000000000000000000000000800A", label: "GRASS", symbol: "GRASS" }],
};

export function getPaymentTokens() {
  return isMainnet() ? PAYMENT_TOKENS.mainnet : PAYMENT_TOKENS.testnet;
}
