"use client";

import React from "react";
import "./text-editor.css";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { EMOJIS } from "@/components/emojis";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChevronDown, Redo2, Smile, Undo2 } from "lucide-react";

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
          "padding: 0.75rem 0.75rem 3rem 0.75rem", // extra bottom padding for toolbar
          "outline: none",
          "background: transparent",
          "border: none",
          "border-radius: 1rem",
          "min-height: 10rem",
          "position: relative",
          "color: #334155",
          "font-size: 0.875rem",
          "line-height: 1.6",
        ].join("; "),
        class: "tiptap w-full min-w-0 max-w-full",
      },
    },
  });

  const insertEmoji = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  };

  return (
    <TooltipProvider>
      <div className="relative flex w-full min-w-0 flex-col rounded-2xl border border-brand-200/40 bg-white/50 backdrop-blur-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
        <div className="flex w-full min-w-0 flex-1">
          <div className="w-full">
            <EditorContent editor={editor} />
            {/* Toolbar at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex w-full items-center gap-2 rounded-b-2xl border-t border-brand-200/60 bg-white/90 px-3 py-2 backdrop-blur-sm">
              {/* Group 1: Bold/Italic */}
              <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700 ${editor?.isActive("bold") ? "bg-brand-100 font-bold text-brand-700" : ""}`}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      type="button"
                      aria-label="Bold"
                      disabled={!editor?.can().chain().focus().toggleBold().run()}
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
                      className={`h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700 ${editor?.isActive("italic") ? "bg-brand-100 italic text-brand-700" : ""}`}
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      type="button"
                      aria-label="Italic"
                      disabled={!editor?.can().chain().focus().toggleItalic().run()}
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
                            editor?.chain().focus().toggleHeading({ level: 1 }).run();
                          }}
                          className={`rounded-lg hover:bg-brand-100 ${editor?.isActive("heading", { level: 1 }) ? "bg-brand-100 font-semibold text-brand-700" : ""}`}
                        >
                          <span className="mr-2 text-lg font-bold">H1</span> Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleHeading({ level: 2 }).run();
                          }}
                          className={`rounded-lg hover:bg-brand-100 ${editor?.isActive("heading", { level: 2 }) ? "bg-brand-100 font-semibold text-brand-700" : ""}`}
                        >
                          <span className="mr-2 text-base font-bold">H2</span> Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleHeading({ level: 3 }).run();
                          }}
                          className={`rounded-lg hover:bg-brand-100 ${editor?.isActive("heading", { level: 3 }) ? "bg-brand-100 font-semibold text-brand-700" : ""}`}
                        >
                          <span className="mr-2 text-base font-bold">H3</span> Heading 3
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleBulletList().run();
                          }}
                          className={`rounded-lg hover:bg-brand-100 ${editor?.isActive("bulletList") ? "bg-brand-100 font-semibold text-brand-700" : ""}`}
                        >
                          <span className="mr-2 text-lg">•</span> Bulleted List
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault();
                            editor?.chain().focus().toggleCode().run();
                          }}
                          disabled={!editor?.can().chain().focus().toggleCode().run()}
                          className={`rounded-lg hover:bg-brand-100 ${editor?.isActive("code") ? "bg-brand-100 font-semibold text-brand-700" : ""}`}
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

              {/* Group 4: Undo/Redo */}
              <div className="flex items-center overflow-hidden rounded-lg border border-brand-200/40 bg-brand-50/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-none bg-transparent text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                      onClick={() => editor?.chain().focus().undo().run()}
                      type="button"
                      aria-label="Undo"
                      disabled={!editor?.can().chain().focus().undo().run()}
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
                      onClick={() => editor?.chain().focus().redo().run()}
                      type="button"
                      aria-label="Redo"
                      disabled={!editor?.can().chain().focus().redo().run()}
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
    </TooltipProvider>
  );
}
