import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface CommunityAccessDeniedProps {
  message?: string;
}

export function CommunityAccessDenied({ message }: CommunityAccessDeniedProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">{message || "Only community owners can access these settings."}</p>
        </CardContent>
      </Card>
    </div>
  );
}
