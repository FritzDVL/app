import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ThreadShareDialogProps {
  open: boolean;
  onClose: () => void;
  threadUrl: string;
  onPostToLens: () => Promise<void>;
}

export function ThreadShareDialog({ open, onClose, threadUrl, onPostToLens }: ThreadShareDialogProps) {
  const { account } = useAuthStore();
  const [posting, setPosting] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(threadUrl);
    toast.success("Thread link copied to clipboard!");
    onClose();
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      await onPostToLens();
      toast.success("Thread shared to your Lens account!");
      onClose();
    } catch {
      toast.error("Failed to post to Lens account");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="border-0 bg-white shadow-lg backdrop-blur-md dark:border-gray-600/60 dark:bg-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Share this thread</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose how you want to share this thread with others.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Button variant="outline" className="flex w-full items-center gap-2 font-semibold" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            Copy link to share
          </Button>
          <Button
            variant="default"
            className="flex w-full items-center gap-2 font-semibold"
            onClick={handlePost}
            disabled={posting || !account}
          >
            <Share2 className="h-4 w-4" />
            Post to Lens
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
