"use server";

import { revalidatePath } from "next/cache";
import { EditCommunityFormData } from "@/hooks/forms/use-community-edit-form";
import { Community } from "@/lib/domain/communities/types";
import { updateCommunity } from "@/lib/services/community/update-community";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";

export async function updateCommunityAction(
  community: Community,
  formData: FormData,
  sessionClient: SessionClient,
  walletClient: WalletClient,
) {
  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logoFile = formData.get("logo") as File | null;

    if (!community.address) {
      return {
        success: false,
        error: "Missing community address",
      };
    }

    const communityData: EditCommunityFormData = {
      name: name,
      description: description,
      logo: logoFile || null,
    };

    const result = await updateCommunity(community, communityData, sessionClient, walletClient);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    revalidatePath(`/communities/${community.address}`);
    revalidatePath(`/communities/${community.address}/settings`);
    revalidatePath(`/`);

    return {
      success: true,
      community: result.community,
    };
  } catch (error) {
    console.error("Error updating community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
