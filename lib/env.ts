export enum Env {
  MAINNET = "mainnet",
  TESTNET = "testnet",
}

export function getCurrentEnv(): Env {
  const env = process.env.NEXT_PUBLIC_LENSFORUM_ENV?.toLowerCase();
  if (env === Env.TESTNET) return Env.TESTNET;
  return Env.MAINNET;
}

export function isMainnet(): boolean {
  return getCurrentEnv() === Env.MAINNET;
}
