"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

interface QuoteButtonProps {
  onQuote: (text: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function QuoteButton({ onQuote, containerRef }: QuoteButtonProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setPosition(null);
        setSelectedText("");
        return;
      }

      const range = selection.getRangeAt(0);
      const container = containerRef.current;

      // Check if selection is inside our container
      if (container && container.contains(range.commonAncestorContainer)) {
        const text = selection.toString().trim();
        if (text.length > 0) {
          const rect = range.getBoundingClientRect();
          // Calculate position relative to viewport, but we'll use fixed positioning for simplicity
          // or absolute if we can guarantee the parent is relative.
          // Let's use fixed for the popover effect.
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 40, // 40px above the selection
          });
          setSelectedText(text);
        } else {
          setPosition(null);
          setSelectedText("");
        }
      } else {
        setPosition(null);
        setSelectedText("");
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [containerRef]);

  if (!position) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
      }}
    >
      <Button
        size="sm"
        className="h-8 gap-1 rounded-full bg-slate-900 px-3 text-xs font-medium text-white shadow-lg hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuote(selectedText);
          // Clear selection
          window.getSelection()?.removeAllRanges();
          setPosition(null);
        }}
      >
        <Quote className="h-3 w-3" />
        Quote
      </Button>
    </div>
  );
}
