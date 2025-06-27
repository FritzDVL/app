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
        <div className="mb-2 flex w-full flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors ${editor.isActive("bold") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
            type="button"
          >
            <span className="text-lg font-bold">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors ${editor.isActive("italic") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
            type="button"
          >
            <span className="text-lg italic">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors ${editor.isActive("strike") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
            type="button"
          >
            <span className="text-lg line-through">S</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors ${editor.isActive("code") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
            type="button"
          >
            <span className="font-mono text-base">&lt;/&gt;</span>
          </button>
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="h-8 w-auto rounded-md bg-slate-100 px-2 text-xs text-slate-500 transition-colors hover:bg-slate-200"
            type="button"
          >
            Clear marks
          </button>
          <button
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="h-8 w-auto rounded-md bg-slate-100 px-2 text-xs text-slate-500 transition-colors hover:bg-slate-200"
            type="button"
          >
            Clear nodes
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("paragraph") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 4 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H4
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 5 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("heading", { level: 6 }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            H6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("bulletList") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Bullet list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("orderedList") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Ordered list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("codeBlock") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Code block
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("blockquote") ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Blockquote
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-auto rounded-md px-2 text-xs text-slate-600 transition-colors hover:bg-slate-100"
          >
            Horizontal rule
          </button>
          <button
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className="h-8 w-auto rounded-md px-2 text-xs text-slate-600 transition-colors hover:bg-slate-100"
          >
            Hard break
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="h-8 w-auto rounded-md px-2 text-xs text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="h-8 w-auto rounded-md px-2 text-xs text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            Redo
          </button>
          <button
            onClick={() => editor.chain().focus().setColor("#958DF1").run()}
            className={`h-8 w-auto rounded-md px-2 text-xs transition-colors ${editor.isActive("textStyle", { color: "#958DF1" }) ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
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
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
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
