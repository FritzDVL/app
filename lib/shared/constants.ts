import { Env, getCurrentEnv } from "@/lib/env";
import { Address } from "@/types/common";

// Mainnet addresses
const MAINNET_APP_ADDRESS: Address = "0x30BB11c7A400cE65Fc13f345AA4c5FFC1C333603";
const MAINNET_BASE_FEED_ADDRESS: Address = "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28";
const MAINNET_ADMIN_USER_ADDRESS: Address = "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f"; //LensForum
const MAINNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xe12543e5f917adA5aeF92B26Bc08E1925ec9F53F";

// Testnet addresses - REPLACE WITH YOUR OWN FROM LENS BUILDER DASHBOARD
const TESTNET_APP_ADDRESS: Address = "0x23c579e074AFf0419F9b7Fca8CC12525dA7C8d29";
const TESTNET_BASE_FEED_ADDRESS: Address = "0x8a7e8371b6c01276E46D55B94936B253603456c8";
const TESTNET_ADMIN_USER_ADDRESS: Address = "0xc93947ed78d87bdeb232d9c29c07fd0e8cf0a43e";
const TESTNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xd12E1aD028d550F85F2a8d9130C46dB77A6A0a41";

// URLs
const MAINNET_APP_URL = "https://lensforum.xyz";
const TESTNET_APP_URL = "http://localhost:3000";

const env = getCurrentEnv();
const isTestnet = env === Env.TESTNET;

export const APP_ADDRESS: Address = isTestnet ? TESTNET_APP_ADDRESS : MAINNET_APP_ADDRESS;
export const BASE_FEED_ADDRESS: Address = isTestnet ? TESTNET_BASE_FEED_ADDRESS : MAINNET_BASE_FEED_ADDRESS;
export const ADMIN_USER_ADDRESS = "0xC93947eD78d87bdeB232D9c29C07Fd0E8cf0A43E"; // Your Confirmed Wallet Address

// The single group address for this forum instance
export const TARGET_GROUP_ADDRESS =
  process.env.NEXT_PUBLIC_TARGET_GROUP_ADDRESS || "0xa9Dd68cA2Bd21140354a95E8ce4CbDa80BC4f775";
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

export const CATEGORIES = [
  {
    label: "Mechanism Design",
    tag: "mechanism-design",
    color: "bg-orange-500",
    description: "Levels and mechanism design discussions",
  },
  { label: "Consensus", tag: "consensus", color: "bg-blue-500", description: "Technical discussions about Consensus" },
  { label: "DA", tag: "da", color: "bg-blue-400", description: "Data Availability" },
  { label: "AA", tag: "aa", color: "bg-blue-600", description: "Account Abstraction" },
  { label: "Security", tag: "security", color: "bg-red-500", description: "Security audits and discussions" },
  { label: "SPIP", tag: "spip", color: "bg-purple-500", description: "Society Protocol Improvement Proposals" },
  { label: "Random", tag: "random", color: "bg-slate-500", description: "Off-topic and random discussions" },
];
