import { useEffect, useState } from "react";
import { getAllNotifications } from "@/lib/services/notifications/get-all-notifications";
import type { Notification } from "@lens-protocol/client";
import { useSessionClient } from "@lens-protocol/react";

export function useNotifications() {
  const sessionClient = useSessionClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (sessionClient.loading) return;
      setLoading(true);
      setError(null);
      const { notifications, error } = await getAllNotifications(sessionClient);
      setNotifications(notifications);
      setError(error);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionClient.data]);

  const isLoading = sessionClient.loading || loading;

  return { notifications, loading: isLoading, error };
}
