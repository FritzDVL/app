"use server";

import { revalidatePath } from "next/cache";
import { Address } from "@/types/common";

export async function revalidateCommunity(address: Address) {
  revalidatePath(`/communities/${address}`);
}
