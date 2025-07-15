"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster position="bottom-right" />
    </div>
  );
};
