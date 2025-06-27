"use client";

import React from "react";
import "./text-editor.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      <div className="w-full overflow-hidden">
        <div className="mb-2 flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50 p-3 shadow-sm">
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
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="group h-8 w-auto rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            type="button"
          >
            Clear marks
          </button>
          <button
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="group h-8 w-auto rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            type="button"
          >
            Clear nodes
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("paragraph")
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 1 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 4 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H4
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 5 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("heading", { level: 6 })
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            H6
          </button>
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
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="group h-8 w-auto rounded-lg border border-transparent bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
          >
            Horizontal rule
          </button>
          <button
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className="group h-8 w-auto rounded-lg border border-transparent bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
          >
            Hard break
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="group h-8 w-auto rounded-lg border border-transparent bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="group h-8 w-auto rounded-lg border border-transparent bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
          >
            Redo
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#958DF1").run()}
            className={`group h-8 w-auto rounded-lg border border-transparent px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${
              editor.isActive("textStyle", { color: "#958DF1" })
                ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-200/50"
                : "bg-white text-slate-700 hover:border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 hover:shadow-md"
            }`}
          >
            Purple
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
