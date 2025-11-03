import { Env, getCurrentEnv } from "@/lib/env";
import { Address } from "@/types/common";

// Mainnet addresses
const MAINNET_APP_ADDRESS: Address = "0x30BB11c7A400cE65Fc13f345AA4c5FFC1C333603";
const MAINNET_BASE_FEED_ADDRESS: Address = "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28";
const MAINNET_ADMIN_USER_ADDRESS: Address = "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f"; //LensForum
const MAINNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xe12543e5f917adA5aeF92B26Bc08E1925ec9F53F";

// Testnet addresses - REPLACE WITH YOUR OWN FROM LENS BUILDER DASHBOARD
const TESTNET_APP_ADDRESS: Address = "0x461090932c2afd871c00F44679678E1C59008f59";
const TESTNET_BASE_FEED_ADDRESS: Address = "0x8a7e8371b6c01276E46D55B94936B253603456c8";
const TESTNET_ADMIN_USER_ADDRESS: Address = "0xF643D2Be4DAc9C6c1f64B780ba01AaF68C6b3611";
const TESTNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xd12E1aD028d550F85F2a8d9130C46dB77A6A0a41";

// URLs
const MAINNET_APP_URL = "https://lensforum.xyz";
const TESTNET_APP_URL = "http://localhost:3000";

const env = getCurrentEnv();
const isTestnet = env === Env.TESTNET;

export const APP_ADDRESS: Address = isTestnet ? TESTNET_APP_ADDRESS : MAINNET_APP_ADDRESS;
export const BASE_FEED_ADDRESS: Address = isTestnet ? TESTNET_BASE_FEED_ADDRESS : MAINNET_BASE_FEED_ADDRESS;
export const ADMIN_USER_ADDRESS: Address = isTestnet ? TESTNET_ADMIN_USER_ADDRESS : MAINNET_ADMIN_USER_ADDRESS;
export const LENS_CONTRACT_GROUP_MANAGER: Address = isTestnet
  ? TESTNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS
  : MAINNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS;

export const APP_URL = isTestnet ? TESTNET_APP_URL : MAINNET_APP_URL;

// Common URLs
export const HEY_URL = "https://hey.xyz/";
export const GROVE_API_URL = "https://api.grove.storage/";
// Usage: import { APP_ADDRESS, BASE_FEED_ADDRESS, ADMIN_USER_ADDRESS } from '@/lib/constants';

export const APP_NAME = isTestnet ? "LensForumV1" : "LensForum";

// Paginations
export const COMMUNITIES_PER_PAGE = 10;
export const THREADS_PER_PAGE = 10;
