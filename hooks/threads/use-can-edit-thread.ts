import { useEffect, useState } from "react";
import { Thread } from "@/lib/domain/threads/types";
import { getThread } from "@/lib/services/thread/get-thread";
import { useSessionClient } from "@lens-protocol/react";

type UseCanEditThreadReturn = {
  canEdit: boolean;
  isLoading: boolean;
};

export function useCanEditThread(thread: Thread): UseCanEditThreadReturn {
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sessionClient = useSessionClient();

  useEffect(() => {
    const determineCanEdit = async () => {
      if (sessionClient.loading) {
        return;
      }
      if (!sessionClient.data) {
        return;
      }
      const threadWithOps = await getThread(thread.address, sessionClient.data);
      if (threadWithOps.error || !threadWithOps.thread) {
        setCanEdit(false);
        setIsLoading(false);
        return;
      }

      const canEditOperation = threadWithOps.thread.rootPost?.operations?.canEdit;
      setCanEdit(canEditOperation?.__typename === "PostOperationValidationPassed");
      setIsLoading(false);
    };

    determineCanEdit();
  }, [sessionClient.data, sessionClient.loading, thread]);

  return { canEdit, isLoading };
}
