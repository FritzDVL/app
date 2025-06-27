"use client";

import React from "react";
import "./text-editor.css";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChevronDown, Redo2, Undo2 } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    content: value,
    editorProps: {
      attributes: {
        style: [
          "width: 100%",
          "max-width: 100%",
          "min-width: 0",
          "display: block",
          "word-break: break-word",
          "white-space: pre-wrap",
          "box-sizing: border-box",
          "padding: 0.5rem 0.75rem 2.5rem 0.75rem", // extra bottom padding for toolbar
          "outline: none",
          "background: transparent",
          "border: 1.5px solid #E5E7EB",
          "border-radius: 0.75rem",
          "min-height: 10rem",
          "position: relative",
          // "border-top: none",
          "border-top-left-radius: 0",
          "border-top-right-radius: 0",
        ].join("; "),
        class: "tiptap w-full min-w-0 max-w-full",
      },
    },
  });

  return (
    <TooltipProvider>
      <div className="relative flex w-full min-w-0 flex-col">
        <div className="flex w-full min-w-0 flex-1">
          <div className="w-full">
            <EditorContent editor={editor} />
            {/* Toolbar at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex w-full items-center gap-0 rounded-b-xl border-t border-gray-200 bg-white/95 px-2 py-1">
              {/* Group 1: Bold/Italic */}
              <div className="flex items-center divide-x divide-gray-300 overflow-hidden rounded-md border border-gray-200 bg-[#F3F4F6]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 rounded-none bg-transparent hover:bg-[#E5E7EB] focus:bg-[#E5E7EB] ${editor?.isActive("bold") ? "font-bold text-brand-600" : "text-gray-700"}`}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      type="button"
                      aria-label="Bold"
                      disabled={!editor?.can().chain().focus().toggleBold().run()}
                    >
                      <span className="text-base font-bold">B</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 rounded-none bg-transparent hover:bg-[#E5E7EB] focus:bg-[#E5E7EB] ${editor?.isActive("italic") ? "italic text-brand-600" : "text-gray-700"}`}
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      type="button"
                      aria-label="Italic"
                      disabled={!editor?.can().chain().focus().toggleItalic().run()}
                    >
                      <span className="text-base italic">I</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
              </div>
              {/* Group 2: Formats Dropdown */}
              <div className="ml-2 flex items-center overflow-hidden rounded-md border border-gray-200 bg-[#F3F4F6]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex h-8 w-8 items-center justify-center gap-1 rounded-none bg-transparent text-gray-700 hover:bg-[#E5E7EB] focus:bg-[#E5E7EB]"
                          aria-label="Formats"
                        >
                          <span className="text-base font-bold">T</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-36 border border-gray-200 bg-white p-1 shadow-lg">
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleBulletList().run();
                          }}
                          className={editor?.isActive("bulletList") ? "font-semibold" : ""}
                        >
                          <span className="mr-2 text-lg">•</span> Bulleted List
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleCode().run();
                          }}
                          disabled={!editor?.can().chain().focus().toggleCode().run()}
                          className={editor?.isActive("code") ? "font-semibold" : ""}
                        >
                          <span className="mr-2 font-mono text-base">&lt;/&gt;</span> Code
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>Formats</TooltipContent>
                </Tooltip>
              </div>
              {/* Group 3: Undo/Redo */}
              <div className="ml-2 flex items-center divide-x divide-gray-300 overflow-hidden rounded-md border border-gray-200 bg-[#F3F4F6]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-none bg-transparent text-gray-700 hover:bg-[#E5E7EB] focus:bg-[#E5E7EB]"
                      onClick={() => editor?.chain().focus().undo().run()}
                      type="button"
                      aria-label="Undo"
                      disabled={!editor?.can().chain().focus().undo().run()}
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-none bg-transparent text-gray-700 hover:bg-[#E5E7EB] focus:bg-[#E5E7EB]"
                      onClick={() => editor?.chain().focus().redo().run()}
                      type="button"
                      aria-label="Redo"
                      disabled={!editor?.can().chain().focus().redo().run()}
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
