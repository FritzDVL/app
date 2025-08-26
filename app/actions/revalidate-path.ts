"use server";

import { revalidatePath } from "next/cache";
import { Address } from "@/types/common";

export async function revalidateCommunityPath(address: Address) {
  revalidatePath(`/communities/${address}`);
}

export async function revalidateCommunitiesPath() {
  revalidatePath(`/communities`);
}

export async function revalidateCommunityAndListPaths(address: Address) {
  await Promise.all([revalidateCommunityPath(address), revalidateCommunitiesPath()]);
}
