"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { defineExtension } from "./extension";
import "./text-editor.css";
import { Toolbar } from "./toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createEditor } from "prosekit/core";
import "prosekit/extensions/list/style.css";
import { ProseKit, useDocChange } from "prosekit/react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useMemo(() => {
    return createEditor({ extension: defineExtension() });
  }, []);

  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountRef.current) {
      editor.mount(mountRef.current);
      return () => {
        editor.unmount();
      };
    }
  }, [editor]);

  // Set initial content when value prop changes (only for external updates)
  useEffect(() => {
    if (value !== undefined && editor.getDocHTML() !== value) {
      // Only update if the content is actually different to avoid unnecessary updates
      const currentHTML = editor.getDocHTML();
      if (currentHTML !== value) {
        editor.setContent(value);
      }
    }
  }, [value, editor]);

  // Listen for content changes
  useDocChange(
    () => {
      const html = editor.getDocHTML();
      onChange(html);
    },
    { editor },
  );

  return (
    <TooltipProvider>
      <ProseKit editor={editor}>
        <div className="relative flex w-full min-w-0 flex-col rounded-2xl border border-brand-200/40 bg-white/50 backdrop-blur-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          <div className="flex w-full min-w-0 flex-1">
            <div className="w-full">
              {/* Editor content area */}
              <div
                ref={mountRef}
                className="min-h-40 w-full min-w-0 max-w-full rounded-t-2xl border-none bg-transparent p-3 pb-12 text-sm leading-relaxed text-slate-700 outline-none"
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
                }}
              />
              <Toolbar />
            </div>
          </div>
        </div>
      </ProseKit>
    </TooltipProvider>
  );
}
