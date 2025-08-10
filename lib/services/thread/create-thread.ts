/**
 * Create Thread Service
 * Creates a thread using the existing API endpoint
 */
import { CreateThreadFormData } from "@/lib/domain/threads/types";
import { Thread } from "@/types/common";

export interface CreateThreadResult {
  success: boolean;
  thread?: Thread;
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
