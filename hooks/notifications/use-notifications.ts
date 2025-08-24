import { useEffect, useState } from "react";
import { APP_ADDRESS } from "@/lib/shared/constants";
import { getNotificationDate } from "@/lib/shared/utils";
import type { Notification } from "@lens-protocol/client";
import { fetchNotifications } from "@lens-protocol/client/actions";
import { NotificationType, useSessionClient } from "@lens-protocol/react";

export function useNotifications() {
  const sessionClient = useSessionClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      if (sessionClient.loading) return;
      setLoading(true);
      setError(null);
      if (!sessionClient.data) {
        setError("You must be logged in to view notifications.");
        setNotifications([]);
        setLoading(false);
        return;
      }
      try {
        // Run both queries in parallel: main notifications and rewards
        const [mainResult, rewardsResult] = await Promise.all([
          fetchNotifications(sessionClient.data, {
            filter: {
              notificationTypes: [NotificationType.Mentioned, NotificationType.Commented, NotificationType.Reacted],
              apps: [APP_ADDRESS],
            },
          }),
          fetchNotifications(sessionClient.data, {
            filter: {
              notificationTypes: [NotificationType.TokenDistributed],
            },
          }),
        ]);

        // If both fail, show error
        if (mainResult.isErr() && rewardsResult.isErr()) {
          setError(mainResult.error.message || rewardsResult.error.message || "Error loading notifications");
          setNotifications([]);
        } else {
          // Merge and sort all notifications by relevant date
          const mainItems = mainResult.isErr() ? [] : (mainResult.value.items as Notification[]);
          const rewardsItems = rewardsResult.isErr() ? [] : (rewardsResult.value.items as Notification[]);
          const allNotifications = [...mainItems, ...rewardsItems].sort((a, b) => {
            const dateA = getNotificationDate(a);
            const dateB = getNotificationDate(b);
            // If any date is invalid, put it at the end
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          setNotifications(allNotifications);
        }
      } catch (e: any) {
        setError(e.message || "Unknown error");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionClient.data]);

  const isLoading = sessionClient.loading || loading;

  return { notifications, loading: isLoading, error };
}
