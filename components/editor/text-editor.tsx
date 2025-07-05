"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "./text-editor.css";
import { Toolbar } from "./toolbar";
import { EMOJIS } from "@/components/emojis";
import { TooltipProvider } from "@/components/ui/tooltip";
import { defineBasicExtension } from "prosekit/basic";
import { createEditor, union } from "prosekit/core";
import { defineImage } from "prosekit/extensions/image";
import { defineList } from "prosekit/extensions/list";
import "prosekit/extensions/list/style.css";
import { ProseKit, useDocChange } from "prosekit/react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useMemo(() => {
    const extension = union(defineBasicExtension(), defineImage(), defineList());
    return createEditor({
      extension,
      defaultContent: value || "",
    });
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

  const insertEmoji = (emoji: string) => {
    editor.commands.insertText({ text: emoji });
  };

  const handleFileUpload = (accept: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          const result = e.target?.result as string;
          if (accept.includes("image")) {
            editor.commands.insertImage({ src: result });
          } else if (accept.includes("video")) {
            // For videos, insert as HTML using ProseKit's commands
            const videoElement = document.createElement("video");
            videoElement.controls = true;
            videoElement.style.maxWidth = "100%";
            videoElement.style.height = "auto";
            videoElement.style.borderRadius = "0.5rem";
            const source = document.createElement("source");
            source.src = result;
            source.type = file.type;
            videoElement.appendChild(source);

            // Insert the video element directly
            editor.commands.insertText({ text: videoElement.outerHTML });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addImage = () => {
    handleFileUpload("image/*");
  };

  const addVideo = () => {
    handleFileUpload("video/*");
  };

  return (
    <TooltipProvider>
      <ProseKit editor={editor}>
        <div className="relative flex w-full min-w-0 flex-col rounded-2xl border border-brand-200/40 bg-white/50 backdrop-blur-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          <div className="flex w-full min-w-0 flex-1">
            <div className="w-full">
              {/* Editor content area */}
              <div
                ref={mountRef}
                className="min-h-40 w-full min-w-0 max-w-full rounded-2xl border-none bg-transparent p-3 pb-12 text-sm leading-relaxed text-slate-700 outline-none"
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
                }}
              />
              <Toolbar
                editor={editor}
                insertEmoji={insertEmoji}
                addImage={addImage}
                addVideo={addVideo}
                EMOJIS={EMOJIS}
              />
            </div>
          </div>
        </div>
      </ProseKit>
    </TooltipProvider>
  );
}
