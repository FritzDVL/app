import { useEffect, useState } from "react";
import { fetchMeDetails } from "@lens-protocol/client/actions";
import { MeResult, useSessionClient } from "@lens-protocol/react";

export function useSignlessStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const sessionClient = useSessionClient();

  useEffect(() => {
    const doCheckIsSignlessEnabled = async () => {
      if (!sessionClient || !sessionClient.data) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await fetchMeDetails(sessionClient.data);
        if (result.isErr()) {
          console.error("Error fetching user details:", result.error);
          return;
        }
        const userDetails = result.value as MeResult;
        setEnabled(userDetails.isSignless);
      } catch (error) {
        console.error("Error checking signless status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    doCheckIsSignlessEnabled();
  }, [sessionClient]);

  return { isLoading, enabled };
}
