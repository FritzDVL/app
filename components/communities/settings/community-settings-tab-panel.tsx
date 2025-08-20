import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunitySettingsTabPanelProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

export function CommunitySettingsTabPanel({ icon: Icon, title, children }: CommunitySettingsTabPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold text-foreground">
            <Icon className="mr-3 h-6 w-6 text-brand-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
