/**
 * Thread Service
 * Orchestrates thread operations using existing API, hooks and external layer
 */
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { fetchFeaturedThreadsOptimized, fetchLatestThreadsOptimized, fetchThreads } from "@/lib/fetchers/threads";
import { Thread } from "@/types/common";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
  error?: string;
}

export interface ThreadsResult {
  success: boolean;
  threads?: Thread[];
  error?: string;
}

/**
 * Creates a thread using the existing API endpoint
 * Based on the logic in use-thread-create.ts hook
 */
export async function createThread(
  communityAddress: string,
  formData: CreateThreadFormData,
): Promise<CreateThreadResult> {
  try {
    const response = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        communityAddress,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        tags: formData.tags || "",
        author: formData.author,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || data.message || "Failed to create thread",
      };
    }

    return {
      success: true,
      // Note: API doesn't return thread object, would need additional logic
      // to fetch and transform the created thread
    };
  } catch (error) {
    console.error("Thread creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread",
    };
  }
}

/**
 * Gets all threads for a community using existing fetchers
 */
export async function getCommunityThreads(communityAddress: string): Promise<ThreadsResult> {
  try {
    const threads = await fetchThreads(communityAddress);

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch community threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch community threads",
    };
  }
}

/**
 * Gets featured threads using existing fetchers
 */
export async function getFeaturedThreads(limit: number = 5): Promise<ThreadsResult> {
  try {
    const threads = await fetchFeaturedThreadsOptimized(limit);

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch featured threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured threads",
    };
  }
}

/**
 * Gets latest threads using existing fetchers
 */
export async function getLatestThreads(limit: number = 5): Promise<ThreadsResult> {
  try {
    const threads = await fetchLatestThreadsOptimized(limit);

    return {
      success: true,
      threads,
    };
  } catch (error) {
    console.error("Failed to fetch latest threads:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch latest threads",
    };
  }
}
