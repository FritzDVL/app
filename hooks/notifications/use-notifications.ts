import { useEffect, useState } from "react";
import { APP_ADDRESS, BASE_FEED_ADDRESS } from "@/lib/constants";
import type { Notification } from "@lens-protocol/client";
import { fetchNotifications } from "@lens-protocol/client/actions";
import { NotificationType, evmAddress, useSessionClient } from "@lens-protocol/react";

export function useNotifications(sessionClient: ReturnType<typeof useSessionClient>) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      setError(null);
      try {
        if (!sessionClient.data) {
          setError("You must be logged in to view notifications.");
          setNotifications([]);
          return;
        }
        const result = await fetchNotifications(sessionClient.data, {
          filter: {
            notificationTypes: [NotificationType.Mentioned, NotificationType.Commented, NotificationType.Reacted],
            apps: [APP_ADDRESS],
            feeds: [{ feed: evmAddress(BASE_FEED_ADDRESS) }],
          },
        });
        if (result.isErr()) {
          setError(result.error.message || "Error loading notifications");
          setNotifications([]);
        } else {
          setNotifications(result.value.items as Notification[]);
        }
      } catch (e: any) {
        setError(e.message || "Unknown error");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [sessionClient.data]);

  return { notifications, loading, error };
}
