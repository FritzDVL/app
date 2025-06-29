import { Address } from "@/types/common";

// Mainnet addresses
const MAINNET_APP_ADDRESS: Address = "0x9dE8564d4dFc6B896C1739f0A53566E7e1DcaC61";
const MAINNET_BASE_FEED_ADDRESS: Address = "0xa28e73183021C5A85F59Eb96b8d291d5D6786824";
const MAINNET_ADMIN_USER_ADDRESS: Address = "0xa93bA2d0d9BfD0d812211806C3Ab7DbD9CbaD17f";

// Testnet addresses
export const TESTNET_APP_ADDRESS: Address = "0x9eD1562A4e3803964F3c84301b18d4E1944D340b";
export const TESTNET_BASE_FEED_ADDRESS: Address = "0x039dB35DC617b083ade172BCA13B9571672CEe71";
export const TESTNET_ADMIN_USER_ADDRESS: Address = "0xeE111B6D0E758A75E586D944cdcad670242F4e0d";

// Use the appropriate address based on the environment
export const APP_ADDRESS: Address = TESTNET_APP_ADDRESS;
export const BASE_FEED_ADDRESS: Address = TESTNET_BASE_FEED_ADDRESS;
export const ADMIN_USER_ADDRESS: Address = TESTNET_ADMIN_USER_ADDRESS;
