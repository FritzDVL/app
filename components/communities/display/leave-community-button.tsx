import { Button } from "@/components/ui/button";
import { Community } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";
import { LogOut } from "lucide-react";

export function LeaveCommunityButton({
  community,
  onDialogOpen,
}: {
  community: Community;
  onDialogOpen: (open: boolean) => void;
}) {
  const { isLoggedIn } = useAuthStore();

  const handleLeave = () => {
    onDialogOpen(true);
  };

  const canLeave = community?.group?.operations?.canLeave.__typename === "GroupOperationValidationPassed";
  if (!canLeave) {
    return null;
  }

  return (
    <Button
      disabled={!isLoggedIn}
      onClick={handleLeave}
      size="sm"
      variant="outline"
      className="h-8 px-3 text-xs font-medium transition-all duration-150"
    >
      <LogOut className="mr-1.5 h-3 w-3" />
      <span className="hidden md:inline">Leave</span>
      <span className="md:hidden">Leave</span>
    </Button>
  );
}
