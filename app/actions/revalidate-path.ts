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

export async function revalidateThreadPath(address: string) {
  revalidatePath(`/thread/${address}`);
}

export async function revalidateThreadsPath() {
  revalidatePath(`/thread`);
}

export async function revalidateThreadAndListPaths(address: Address) {
  await Promise.all([revalidateThreadPath(address), revalidateThreadsPath()]);
}
