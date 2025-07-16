import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface LeaveCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LeaveCommunityDialog({ open, onOpenChange, onConfirm }: LeaveCommunityDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md rounded-3xl bg-white p-8 backdrop-blur-sm dark:border-gray-600/60 dark:bg-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <span className="inline-block rounded-full bg-gradient-to-br from-brand-500 to-brand-600 p-2 text-white">
              <AlertCircle className="h-6 w-6" />
            </span>
            Leave community?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-4 text-base text-muted-foreground">Are you sure you want to leave this community?</div>
        <AlertDialogFooter className="mt-6 flex flex-row justify-end gap-3">
          <AlertDialogCancel className="rounded-full bg-muted px-6 py-2 font-semibold text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-muted/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
