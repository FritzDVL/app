"use client";

import * as React from "react";
import { cn } from "@/lib/shared/utils";
import * as SwitchPrimitives from "@radix-ui/react-switch";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Track - Enhanced visibility with better contrast
      "focus-visible:ring-3 peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 shadow-md transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-brand-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      // Light theme states
      "border-gray-300 bg-gray-200 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500 data-[state=checked]:shadow-brand-500/25",
      // Dark theme states
      "dark:border-gray-600 dark:bg-gray-700 dark:data-[state=checked]:border-brand-400 dark:data-[state=checked]:bg-brand-500 dark:data-[state=checked]:shadow-brand-400/25",
      // Hover states
      "hover:shadow-lg data-[state=checked]:hover:shadow-brand-500/30 dark:data-[state=checked]:hover:shadow-brand-400/30",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Thumb - Enhanced with better shadows and transitions
        "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        // Light theme thumb
        "border border-gray-300 bg-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:shadow-xl",
        // Dark theme thumb
        "dark:border-gray-500 dark:bg-gray-100 dark:data-[state=checked]:border-gray-100 dark:data-[state=checked]:bg-white dark:data-[state=checked]:shadow-xl",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
