"use server";

import { cookies } from "next/headers";
import { Address } from "@/types/common";

export async function persistWalletAndAccountToCookie(wallet: Address, lensAccount: Address) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "lensforum-session",
    value: JSON.stringify({ walletAddress: wallet, lensAccountAddress: lensAccount }),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getWalletAndAccountFromCookie(): Promise<{
  walletAddress: Address;
  lensAccountAddress: Address;
} | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("lensforum-session");
  if (!session) return null;
  try {
    const data = JSON.parse(session.value);
    return {
      walletAddress: data.walletAddress as Address,
      lensAccountAddress: data.lensAccountAddress as Address,
    };
  } catch (e) {
    console.error("Error parsing session cookie:", e);
    return null;
  }
}
