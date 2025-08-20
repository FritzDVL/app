"use server";

import { revalidatePath } from "next/cache";
import { updateCommunity } from "@/lib/services/community/update-community";
import { Address } from "@/types/common";

export async function updateCommunityAction(address: Address, formData: FormData) {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const logoFile = formData.get("logo") as File | null;

    if (!address) {
      return {
        success: false,
        error: "Missing community address",
      };
    }

    // Only include fields that are present
    const updateData: any = {};
    if (name !== null) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (logoFile) updateData.logo = logoFile;

    const result = await updateCommunity(address, updateData);

    if (result.success) {
      revalidatePath(`/communities/${address}`);
      revalidatePath(`/communities/${address}/settings`);
      revalidatePath(`/`);
      return {
        success: true,
        community: result.community,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    console.error("Error updating community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
