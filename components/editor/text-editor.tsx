"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "./text-editor.css";
import { EMOJIS } from "@/components/emojis";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ImageIcon, Redo2, Smile, Undo2, Video } from "lucide-react";
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
                className="min-h-40 w-full min-w-0 max-w-full rounded-t-2xl border-none bg-transparent p-3 pb-12 text-sm leading-relaxed text-slate-700 outline-none"
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  boxSizing: "border-box",
                }}
              />

              {/* Toolbar at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-10 flex w-full items-center gap-2 rounded-b-2xl border-t border-brand-200/60 bg-white/90 px-3 py-2 backdrop-blur-sm">
                {/* Group 1: Bold/Italic */}
                <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                        onClick={() => editor.commands.toggleBold()}
                        type="button"
                        aria-label="Bold"
                      >
                        <span className="text-sm font-bold">B</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bold</TooltipContent>
                  </Tooltip>
                  <div className="h-4 w-px bg-brand-200/60"></div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                        onClick={() => editor.commands.toggleItalic()}
                        type="button"
                        aria-label="Italic"
                      >
                        <span className="text-sm italic">I</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Italic</TooltipContent>
                  </Tooltip>
                </div>

                {/* Group 2: Formats Dropdown */}
                <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex h-7 w-8 items-center justify-center gap-1 rounded-none bg-transparent pl-1 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                            aria-label="Formats"
                          >
                            <span className="text-sm font-bold">T</span>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-36 rounded-xl border border-brand-200/60 bg-white/95 p-1 shadow-lg backdrop-blur-sm"
                        >
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              editor.commands.setHeading({ level: 1 });
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <span className="mr-2 text-lg font-bold">H1</span> Heading 1
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              editor.commands.setHeading({ level: 2 });
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <span className="mr-2 text-base font-bold">H2</span> Heading 2
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              editor.commands.setHeading({ level: 3 });
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <span className="mr-2 text-base font-bold">H3</span> Heading 3
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              editor.commands.toggleList({ kind: "bullet" });
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <span className="mr-2 text-lg">•</span> Bulleted List
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              editor.commands.toggleCode();
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <span className="mr-2 font-mono text-base">&lt;/&gt;</span> Code
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>Formats</TooltipContent>
                  </Tooltip>
                </div>

                {/* Group 3: Emoji Picker */}
                <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                            aria-label="Add Emoji"
                          >
                            <Smile className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-72 rounded-xl border border-brand-200/60 bg-white/95 p-3 shadow-lg backdrop-blur-sm"
                        >
                          <div className="mb-2 text-xs font-medium text-slate-600">Popular Emojis</div>
                          <div className="grid max-h-48 grid-cols-8 gap-1 overflow-y-auto">
                            {EMOJIS.map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => insertEmoji(emoji)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-brand-100"
                                type="button"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>Add Emoji</TooltipContent>
                  </Tooltip>
                </div>

                {/* Group 4: Media Upload */}
                <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex h-7 w-9 items-center justify-center gap-1 rounded-none bg-transparent pl-1 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                            aria-label="Add Media"
                          >
                            <ImageIcon className="h-3 w-3" />
                            <ChevronDown className="h-2 w-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-36 rounded-xl border border-brand-200/60 bg-white/95 p-1 shadow-lg backdrop-blur-sm"
                        >
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              addImage();
                            }}
                            className="rounded-lg hover:bg-brand-100"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Image
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={e => {
                              e.preventDefault();
                              addVideo();
                            }}
                            className="rounded-lg hover:bg-brand-100"
                            disabled
                          >
                            <Video className="mr-2 h-4 w-4" />
                            Upload Video
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>Add Media</TooltipContent>
                  </Tooltip>
                </div>

                {/* Group 5: Undo/Redo */}
                <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                        onClick={() => editor.commands.undo()}
                        type="button"
                        aria-label="Undo"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo</TooltipContent>
                  </Tooltip>
                  <div className="h-4 w-px bg-brand-200/60"></div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                        onClick={() => editor.commands.redo()}
                        type="button"
                        aria-label="Redo"
                      >
                        <Redo2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProseKit>
    </TooltipProvider>
  );
}
