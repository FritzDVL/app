"use server";

import { revalidatePath } from "next/cache";
import { CreateCommunityFormData } from "@/hooks/forms/use-community-create-form";
import { createCommunity } from "@/lib/services/community/create-community";
import { Address } from "@/types/common";

export async function createCommunityAction(formData: FormData) {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const adminAddress = formData.get("adminAddress") as Address;
    const logoFile = formData.get("logo") as File | null;

    if (!name || !description || !adminAddress) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const communityData: CreateCommunityFormData = {
      name,
      description,
      adminAddress,
      logo: logoFile || undefined,
    };

    // Create the community using simplified service interface
    const result = await createCommunity(communityData);

    if (result.success) {
      revalidatePath(`/communities`);

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
    console.error("Error creating community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
