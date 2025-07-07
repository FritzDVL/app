import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TooltipContent, TooltipRoot, TooltipTrigger } from "prosekit/react/tooltip";

export default function ToolbarButton({
  pressed,
  disabled,
  onClick,
  tooltip,
  children,
}: {
  pressed?: boolean;
  disabled?: boolean;
  onClick?: VoidFunction;
  tooltip?: string;
  children: ReactNode;
}) {
  return (
    <TooltipRoot>
      <TooltipTrigger className="block">
        <button
          type="button"
          data-state={pressed ? "on" : "off"}
          disabled={disabled}
          onClick={() => onClick?.()}
          onMouseDown={event => event.preventDefault()}
          className={cn(
            // Base styles - improved visibility and contrast
            "relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
            "disabled:pointer-events-none disabled:opacity-50",
            // Default state - better contrast
            "border border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            // Active/pressed state - clear visual feedback
            "data-[state=on]:border-blue-200 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:shadow-sm",
            // Dark mode support
            "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
            "dark:data-[state=on]:border-blue-700 dark:data-[state=on]:bg-blue-900/50 dark:data-[state=on]:text-blue-300",
          )}
        >
          {children}
          {tooltip ? <span className="sr-only">{tooltip}</span> : null}
        </button>
      </TooltipTrigger>
      {tooltip ? (
        <TooltipContent className="rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg">
          {tooltip}
        </TooltipContent>
      ) : null}
    </TooltipRoot>
  );
}
