import { useState } from "react";
import { setThreadVisibility } from "@/lib/external/supabase/threads";

export function useThreadVisibility() {
  const [isPending, setIsPending] = useState(false);

  const toggleVisibility = async (threadId: string, isVisible: boolean) => {
    setIsPending(true);
    try {
      await setThreadVisibility(threadId, isVisible);
    } catch (error) {
      console.error("Failed to update thread visibility:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { toggleVisibility, isPending };
}
