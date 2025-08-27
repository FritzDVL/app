import { fetchAllNotifications } from "@/lib/external/lens/primitives/notifications";
import type { Notification } from "@lens-protocol/client";

export async function getAllNotifications(sessionClient: any): Promise<{
  notifications: Notification[];
  error: string | null;
}> {
  if (!sessionClient || !sessionClient.data) {
    return {
      notifications: [],
      error: "You must be logged in to view notifications.",
    };
  }
  try {
    const notifications = await fetchAllNotifications(sessionClient.data);
    return { notifications, error: null };
  } catch (e: any) {
    return {
      notifications: [],
      error: e.message || "Unknown error",
    };
  }
}
