"use client";

import { AlertTriangle } from "lucide-react";

export function TestnetBanner() {
  return (
    <div className="bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-white dark:bg-yellow-600">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>Testnet Mode: Data may be reset periodically.</span>
      </div>
    </div>
  );
}
