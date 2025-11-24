import { useState } from "react";
import { pinThread } from "@/lib/external/supabase/threads";

export function usePinThread() {
  const [isPending, setIsPending] = useState(false);

  const togglePin = async (threadId: string, isPinned: boolean) => {
    setIsPending(true);
    try {
      await pinThread(threadId, isPinned);
      // We can't use revalidatePath here directly as it's a server action,
      // but we'll handle revalidation in the component or via a server action wrapper if needed.
      // For now, we assume the caller handles UI updates or refresh.
    } catch (error) {
      console.error("Failed to pin thread:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { togglePin, isPending };
}
