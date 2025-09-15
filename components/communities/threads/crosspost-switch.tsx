"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";

interface CrosspostSwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function CrosspostSwitch({ checked, onCheckedChange }: CrosspostSwitchProps) {
  return (
    <div className="mb-6 rounded-2xl border border-brand-200/40 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-gray-700/60 dark:bg-slate-800/90">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="crosspost-switch" className="text-sm font-medium text-foreground">
            Enable crosspost and show all posts of this community
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Includes posts created with other Lens apps (Orb, Hey, etc.)
          </p>
        </div>
        <Switch
          id={"crosspost-switch"}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label="Enable crosspost and show all posts of this community"
        />
      </div>
    </div>
  );
}
