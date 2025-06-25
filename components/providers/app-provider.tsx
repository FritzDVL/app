"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {children}
      <Toaster position="bottom-right" />
    </div>
  );
};
