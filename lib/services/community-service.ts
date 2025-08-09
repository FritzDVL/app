/**
 * Community Service
 * Orchestrates community operations using existing API and external layer
 */
import { CreateCommunityFormData } from "@/lib/domain/communities/types";
import { fetchCommunities, fetchCommunitiesJoined } from "@/lib/fetchers/communities";
import { fetchCommunity } from "@/lib/fetchers/community";
import { Address, Community } from "@/types/common";

export interface CreateCommunityResult {
  success: boolean;
  community?: any;
  error?: string;
}

export interface CommunitiesResult {
  success: boolean;
  communities?: Community[];
  error?: string;
}

export interface CommunityResult {
  success: boolean;
  community?: Community;
  error?: string;
}

/**
 * Creates a community using the existing API endpoint
 * Based on the logic in community-create-form.tsx component
 */
export async function createCommunity(
  formData: CreateCommunityFormData,
  imageFile?: File,
): Promise<CreateCommunityResult> {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("adminAddress", formData.adminAddress);

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    const response = await fetch("/api/communities", {
      method: "POST",
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || "Failed to create community",
      };
    }

    return {
      success: true,
      community: result.community,
    };
  } catch (error) {
    console.error("Community creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create community",
    };
  }
}

/**
 * Gets all communities using existing fetchers
 */
export async function getAllCommunities(
  sortBy: keyof Community | null = null,
  sortOrder: "asc" | "desc" = "desc",
): Promise<CommunitiesResult> {
  try {
    const communities = await fetchCommunities(sortBy, sortOrder);

    return {
      success: true,
      communities,
    };
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch communities",
    };
  }
}

/**
 * Gets a single community by address using existing fetchers
 */
export async function getCommunity(address: string): Promise<CommunityResult> {
  try {
    const community = await fetchCommunity(address);

    if (!community) {
      return {
        success: false,
        error: "Community not found",
      };
    }

    return {
      success: true,
      community,
    };
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community",
    };
  }
}

/**
 * Gets communities that a user has joined using existing fetchers
 */
export async function getJoinedCommunities(memberAddress: Address): Promise<CommunitiesResult> {
  try {
    const communities = await fetchCommunitiesJoined(memberAddress);

    return {
      success: true,
      communities,
    };
  } catch (error) {
    console.error("Failed to fetch joined communities:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch joined communities",
    };
  }
}
