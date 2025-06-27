"use client";

import React from "react";
import "./text-editor.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Redo2, Undo2 } from "lucide-react";

const headingOptions = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading 1", value: 1 },
  { label: "Heading 2", value: 2 },
  { label: "Heading 3", value: 3 },
  { label: "Heading 4", value: 4 },
  { label: "Heading 5", value: 5 },
  { label: "Heading 6", value: 6 },
];

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="w-full space-y-2">
      <div className="w-full overflow-hidden">
        <div className="mb-2 flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 p-3 shadow-sm">
          {/* Mark buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent p-0 shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("bold")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
            type="button"
          >
            <span className="text-lg font-bold transition-transform group-hover:scale-110">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent p-0 shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("italic")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
            type="button"
          >
            <span className="text-lg italic transition-transform group-hover:scale-110">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent p-0 shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("strike")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
            type="button"
          >
            <span className="text-lg line-through transition-transform group-hover:scale-110">S</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent p-0 shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("code")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
            type="button"
          >
            <span className="font-mono text-base transition-transform group-hover:scale-110">&lt;/&gt;</span>
          </button>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          {/* Heading/Paragraph selector */}
          <Select
            value={(() => {
              if (editor.isActive("paragraph")) return "paragraph";
              for (let i = 1; i <= 6; i++) {
                if (editor.isActive("heading", { level: i })) return i.toString();
              }
              return "paragraph";
            })()}
            onValueChange={val => {
              if (val === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: Number(val) as any })
                  .run();
              }
            }}
          >
            <SelectTrigger className="h-8 w-32 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="Heading" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {headingOptions.map(opt => (
                <SelectItem
                  key={opt.value}
                  value={opt.value.toString()}
                  className="hover:text-primary focus:text-primary"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          {/* List/Block buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("bulletList")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Bullet list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("orderedList")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Ordered list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("codeBlock")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Code block
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("blockquote")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Blockquote
          </button>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          {/* Undo/Redo with icons */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="group flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-white text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
            type="button"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="group flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-white text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
            type="button"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <div className="mx-2 h-6 w-px bg-slate-200" />
          {/* Clear marks/nodes */}
          <button
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="group h-8 w-auto rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            type="button"
          >
            Clear format
          </button>
        </div>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
    },
    orderedList: {
      keepMarks: true,
    },
  }),
];

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>
<blockquote>
  Wow, that's amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

export function TextEditor() {
  return (
    <div className="tiptap-editor-container flex w-full min-w-0 flex-col">
      <div className="flex w-full min-w-0 flex-1">
        <div className="w-full min-w-0 flex-1">
          <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={content}
            editorProps={{
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
                  "border-top: none",
                  "border-top-left-radius: 0",
                  "border-top-right-radius: 0",
                ].join("; "),
                class: "tiptap w-full min-w-0 max-w-full",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
