import type { ReactNode } from "react";
import { cn } from "@/lib/shared/utils";
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
            "border border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            // Active/pressed state - clear visual feedback
            "data-[state=on]:border-primary/20 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:shadow-sm",
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
