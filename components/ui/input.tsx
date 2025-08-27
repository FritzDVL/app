import * as React from "react";
import { cn } from "@/lib/shared/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Unified style: same as content text editor (not fully rounded, subtle border)
          "flex h-12 w-full rounded-2xl border border-brand-200/40 bg-gray-50/80 px-4 py-2 text-base ring-offset-background placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700/60 dark:bg-slate-800/90",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
