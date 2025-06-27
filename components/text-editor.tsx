"use client";

import React from "react";
import "./text-editor.css";
import { Button } from "./ui/button";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
          "padding: 0.5rem 0.75rem",
          "outline: none",
          "background: transparent",
          "border: 1px solid rgb(226 232 240)",
          "border-radius: 0.5rem",
          // "border-top: none",
          "border-top-left-radius: 0",
          "border-top-right-radius: 0",
        ].join("; "),
        class: "tiptap w-full min-w-0 max-w-full",
      },
    },
  });

  return (
    <div className="tiptap-editor-container flex w-full min-w-0 flex-col">
      <div className="flex w-full min-w-0 flex-1">
        <div className="w-full min-w-0 flex-1">
          {editor && (
            <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
              <Button
                size="icon"
                variant="default"
                className={`h-8 w-8 border-2 !border-gray-200 !bg-[#F3F4F6] p-0 shadow-sm transition-colors duration-150 hover:!bg-[#E5E7EB] focus:!bg-[#E5E7EB] ${editor.isActive("bold") ? "border-brand-500 font-bold" : "text-gray-700"}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                type="button"
                aria-label="Bold"
              >
                <span className="text-base font-bold">B</span>
              </Button>
              <Button
                size="icon"
                variant="default"
                className={`h-8 w-8 border-2 !border-gray-200 !bg-[#F3F4F6] p-0 shadow-sm transition-colors duration-150 hover:!bg-[#E5E7EB] focus:!bg-[#E5E7EB] ${editor.isActive("italic") ? "border-brand-500 italic" : "text-gray-700"}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                type="button"
                aria-label="Italic"
              >
                <span className="text-base italic">I</span>
              </Button>
              <Button
                size="icon"
                variant="default"
                className={`h-8 w-8 border-2 !border-gray-200 !bg-[#F3F4F6] p-0 shadow-sm transition-colors duration-150 hover:!bg-[#E5E7EB] focus:!bg-[#E5E7EB] ${editor.isActive("strike") ? "border-brand-500 line-through" : "text-gray-700"}`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                type="button"
                aria-label="Strikethrough"
              >
                <span className="text-base line-through">S</span>
              </Button>
            </BubbleMenu>
          )}

          {editor && (
            <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
              {/*
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`group flex h-8 w-8 items-center justify-center rounded-lg border-2 border-brand-500 bg-white/90 p-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400/50 ${
                  editor.isActive("heading", { level: 1 })
                    ? "border-brand-600 bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                    : "text-slate-700 hover:border-brand-400"
                }`}
                type="button"
              >
                <span className="text-base font-bold transition-transform group-hover:scale-125">H1</span>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`group flex h-8 w-8 items-center justify-center rounded-lg border-2 border-brand-500 bg-white/90 p-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-400/50 ${
                  editor.isActive("heading", { level: 2 })
                    ? "border-brand-600 bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                    : "text-slate-700 hover:border-brand-400"
                }`}
                type="button"
              >
                <span className="text-base font-bold transition-transform group-hover:scale-125">H2</span>
              </button>
              */}
              {/*
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`group flex h-8 w-8 items-center justify-center rounded-lg border-2 border-brand-500 bg-slate-100 p-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50 ${
                  editor.isActive("bulletList")
                    ? "border-brand-600 bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                    : "text-slate-700 hover:border-brand-400"
                }`}
                type="button"
              >
                <span className="text-base transition-transform group-hover:scale-125">•</span>
              </button>
              */}
            </FloatingMenu>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
