import { Env, getCurrentEnv } from "@/lib/env";
import { Address } from "@/types/common";

// Mainnet addresses
const MAINNET_APP_ADDRESS: Address = "0x30BB11c7A400cE65Fc13f345AA4c5FFC1C333603";
const MAINNET_BASE_FEED_ADDRESS: Address = "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28";
const MAINNET_ADMIN_USER_ADDRESS: Address = "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f"; //LensForum

// Testnet addresses
const TESTNET_APP_ADDRESS: Address = "0x9eD1562A4e3803964F3c84301b18d4E1944D340b";
const TESTNET_BASE_FEED_ADDRESS: Address = "0x039dB35DC617b083ade172BCA13B9571672CEe71";
const TESTNET_ADMIN_USER_ADDRESS: Address = "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f";

const env = getCurrentEnv();
const isTestnet = env === Env.TESTNET;

export const APP_ADDRESS: Address = isTestnet ? TESTNET_APP_ADDRESS : MAINNET_APP_ADDRESS;
export const BASE_FEED_ADDRESS: Address = isTestnet ? TESTNET_BASE_FEED_ADDRESS : MAINNET_BASE_FEED_ADDRESS;
export const ADMIN_USER_ADDRESS: Address = isTestnet ? TESTNET_ADMIN_USER_ADDRESS : MAINNET_ADMIN_USER_ADDRESS;

// Common URLs
export const HEY_URL = "https://hey.xyz/";
export const GROVE_API_URL = "https://api.grove.storage/";
// Usage: import { APP_ADDRESS, BASE_FEED_ADDRESS, ADMIN_USER_ADDRESS } from '@/lib/constants';
