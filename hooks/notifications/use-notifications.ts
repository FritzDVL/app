import { useEffect, useState } from "react";
import { APP_ADDRESS } from "@/lib/shared/constants";
import type { Notification } from "@lens-protocol/client";
import { fetchNotifications } from "@lens-protocol/client/actions";
import { NotificationType, useSessionClient } from "@lens-protocol/react";

export function useNotifications() {
  const sessionClient = useSessionClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      // Don't fetch if session is still loading
      if (sessionClient.loading) {
        return;
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionClient.data]); // Intentionally omitting sessionClient.loading to prevent flickering

  // If session is still loading, show loading state
  const isLoading = sessionClient.loading || loading;

  return { notifications, loading: isLoading, error };
}
